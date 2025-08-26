"""
Service for extracting product information from PDF documents.
Supports both text-based and scanned PDFs with OCR capabilities.
"""
import re
import logging
import numpy as np
from typing import Optional, Dict, Any, Tuple, List
import pdfplumber
from pdf2image import convert_from_bytes
import pytesseract
import nltk
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
import tabula
from langdetect import detect
from ..models.product import ProductType, ComplianceStatus

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Download required NLTK data
try:
    required_nltk_data = [
        'punkt',
        'stopwords',
        'averaged_perceptron_tagger',
        'maxent_ne_chunker',
        'words'
    ]
    
    for item in required_nltk_data:
        try:
            nltk.data.find(f'tokenizers/{item}')
        except LookupError:
            logger.info(f"Downloading NLTK data: {item}")
            nltk.download(item, quiet=True)
except Exception as e:
    logger.error(f"Error downloading NLTK data: {str(e)}")
    raise

class ProductExtractor:
    def __init__(self):
        self.confidence_threshold = 0.7  # Confidence threshold for extracted information
        self.currency_symbols = {
            '₱': 'PHP',  # Philippine Peso
            '$': 'USD',  # US Dollar
            '€': 'EUR',  # Euro
            '£': 'GBP'   # British Pound
        }
        # Known document templates
        self.templates = {
            'credit_card': [
                r'credit\s+card\s+application',
                r'card\s+benefits',
                r'annual\s+fee',
                r'rewards\s+program'
            ],
            'personal_loan': [
                r'loan\s+application',
                r'interest\s+rate',
                r'loan\s+term',
                r'collateral'
            ],
            'microfinance': [
                r'group\s+lending',
                r'micro\s+loan',
                r'weekly\s+payment',
                r'financial\s+literacy'
            ],
            'savings': [
                r'savings\s+account',
                r'interest\s+rate',
                r'minimum\s+balance',
                r'atm\s+card'
            ]
        }
        
    def _detect_template(self, text: str) -> Tuple[Optional[str], float]:
        """Detect which template the document matches"""
        max_score = 0
        best_match = None
        
        for template_name, patterns in self.templates.items():
            score = sum(1 for pattern in patterns if re.search(pattern, text.lower()))
            confidence = score / len(patterns)
            if confidence > max_score:
                max_score = confidence
                best_match = template_name
                
        return best_match, max_score

    def _detect_languages(self, text: str) -> List[str]:
        """Detect languages in the text"""
        try:
            # Use langdetect for primary language detection
            primary_lang = detect(text)
            return [primary_lang]
        except Exception as e:
            logger.warning(f"Language detection failed: {str(e)}")
            return ['eng']  # Default to English
            
    def _preprocess_text(self, text: str) -> str:
        """Clean and normalize text for better extraction"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Normalize currency symbols
        for symbol in self.currency_symbols:
            text = text.replace(symbol, f" {symbol} ")
            
        # Normalize dashes and hyphens
        text = re.sub(r'[–—‐-]', '-', text)
        
        return text.strip()

    def _extract_amount_range(self, text: str) -> Optional[Tuple[float, float, str]]:
        """Extract amount range from text with currency"""
        # Handle various currency formats
        currency_pattern = '|'.join(re.escape(symbol) for symbol in self.currency_symbols)
        pattern = f'({currency_pattern})?\s*([\d,]+\.?\d*)\s*[–-]\s*({currency_pattern})?\s*([\d,]+\.?\d*)'
        
        matches = re.finditer(pattern, text)
        best_match = None
        highest_confidence = 0
        
        for match in matches:
            try:
                # Determine currency
                currency_symbol = match.group(1) or match.group(3)
                currency = self.currency_symbols.get(currency_symbol, 'PHP')  # Default to PHP
                
                # Extract and clean amounts
                min_amount = float(match.group(2).replace(',', ''))
                max_amount = float(match.group(4).replace(',', ''))
                
                # Calculate confidence based on context and value reasonableness
                confidence = self._calculate_amount_confidence(
                    min_amount, max_amount, 
                    text[max(0, match.start()-50):match.end()+50]
                )
                
                if confidence > highest_confidence:
                    highest_confidence = confidence
                    best_match = (min_amount, max_amount, currency)
                
            except ValueError:
                continue
        
        return best_match if best_match and highest_confidence >= self.confidence_threshold else None

    def _calculate_amount_confidence(self, min_amount: float, max_amount: float, context: str) -> float:
        """Calculate confidence score for extracted amount range"""
        confidence = 1.0
        
        # Check if values are reasonable
        if min_amount > max_amount:
            confidence *= 0.5
        if min_amount < 0 or max_amount < 0:
            confidence *= 0.3
        
        # Check if context contains relevant keywords
        amount_keywords = ['amount', 'limit', 'loan', 'credit', 'balance']
        keyword_confidence = any(keyword in context.lower() for keyword in amount_keywords)
        if not keyword_confidence:
            confidence *= 0.7
            
        return confidence

    def _extract_tenure_range(self, text: str) -> Optional[Tuple[int, int]]:
        """Extract tenure range from text with unit conversion"""
        # Define tenure patterns with different units
        patterns = {
            'months': [
                r'\b(\d+)\s*(?:months?|mo\.?)\b',
                r'\b(\d+)\s*(?:mos?\.?)\b'
            ],
            'years': [
                r'\b(\d+)\s*(?:years?|yrs?\.?)\b',
                r'\b(\d+)\s*(?:y\.?)\b'
            ],
            'weeks': [
                r'\b(\d+)\s*(?:weeks?|wks?\.?)\b',
                r'\b(\d+)\s*(?:w\.?)\b'
            ]
        }
        
        all_values = []
        for unit, unit_patterns in patterns.items():
            for pattern in unit_patterns:
                matches = re.finditer(pattern, text.lower())
                for match in matches:
                    try:
                        value = int(match.group(1))
                        # Convert to months
                        if unit == 'years':
                            value *= 12
                        elif unit == 'weeks':
                            value = round(value * 12 / 52)
                        all_values.append(value)
                    except ValueError:
                        continue
        
        if all_values:
            return (min(all_values), max(all_values))
        return None

    def _extract_interest_rate(self, text: str) -> Optional[Tuple[float, float]]:
        """Extract interest rate range from text with various formats"""
        patterns = [
            # Standard percentage range (e.g., 5% - 10%)
            r'(\d+\.?\d*)%?\s*[–-]\s*(\d+\.?\d*)%',
            # APR format
            r'APR:?\s*(\d+\.?\d*)%?\s*[–-]\s*(\d+\.?\d*)%',
            # Per annum format
            r'(?:per annum|p\.a\.):?\s*(\d+\.?\d*)%?\s*[–-]\s*(\d+\.?\d*)%',
            # Monthly rate (convert to annual)
            r'monthly\s+rate:?\s*(\d+\.?\d*)%?\s*[–-]\s*(\d+\.?\d*)%'
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                try:
                    min_rate = float(match.group(1))
                    max_rate = float(match.group(2))
                    
                    # If it's a monthly rate, convert to annual
                    if 'monthly' in match.group(0).lower():
                        min_rate *= 12
                        max_rate *= 12
                    
                    # Validate rates
                    if 0 <= min_rate <= max_rate <= 100:
                        return (min_rate, max_rate)
                except ValueError:
                    continue
        
        return None

    def _extract_tables(self, file_contents: bytes) -> List[Dict[str, Any]]:
        """Extract tables from PDF using tabula-py"""
        tables = []
        try:
            # Convert bytes to file-like object
            from io import BytesIO
            pdf_file = BytesIO(file_contents)
            
            # Extract all tables from the PDF
            raw_tables = tabula.read_pdf(
                pdf_file,
                pages='all',
                multiple_tables=True,
                guess=True,
                lattice=True,
                stream=True
            )
            
            # Process each table
            for table in raw_tables:
                if not table.empty:
                    # Convert DataFrame to dict
                    table_dict = table.to_dict('records')
                    
                    # Extract column names
                    columns = list(table.columns)
                    
                    tables.append({
                        'columns': columns,
                        'data': table_dict,
                        'shape': table.shape
                    })
            
            logger.info(f"Extracted {len(tables)} tables from PDF")
            return tables
            
        except Exception as e:
            logger.warning(f"Table extraction failed: {str(e)}")
            return []

    def _get_product_type(self, text: str) -> Tuple[Optional[ProductType], float]:
        """Determine product type from text with confidence score"""
        text = text.lower()
        
        # Define type-specific keywords with weights
        type_keywords = {
            ProductType.CREDIT_CARD: {
                'primary': ['credit card', 'creditcard', 'card application'],
                'secondary': ['annual fee', 'rewards', 'cash back', 'points']
            },
            ProductType.PERSONAL_LOAN: {
                'primary': ['personal loan', 'unsecured loan', 'term loan'],
                'secondary': ['loan application', 'collateral', 'loan purpose']
            },
            ProductType.MICROFINANCE_LOAN: {
                'primary': ['microfinance', 'micro loan', 'group loan'],
                'secondary': ['group lending', 'weekly payment', 'financial literacy']
            },
            ProductType.SAVINGS_ACCOUNT: {
                'primary': ['savings account', 'deposit account', 'savings deposit'],
                'secondary': ['minimum balance', 'interest rate', 'atm card']
            }
        }
        
        best_match = None
        highest_confidence = 0
        
        for product_type, keywords in type_keywords.items():
            confidence = 0
            
            # Check primary keywords (more weight)
            primary_matches = sum(1 for term in keywords['primary'] if term in text)
            confidence += (primary_matches / len(keywords['primary'])) * 0.7
            
            # Check secondary keywords (less weight)
            secondary_matches = sum(1 for term in keywords['secondary'] if term in text)
            confidence += (secondary_matches / len(keywords['secondary'])) * 0.3
            
            if confidence > highest_confidence:
                highest_confidence = confidence
                best_match = product_type
        
        return best_match, highest_confidence

    def _extract_text_from_pdf(self, file_contents: bytes) -> Tuple[str, List[Dict[str, Any]]]:
        """Extract text and tables from PDF using OCR if needed"""
        try:
            text = ""
            tables = []
            
            # First try direct text extraction with pdfplumber
            try:
                from io import BytesIO
                pdf_file = BytesIO(file_contents)
                
                # Extract tables first
                tables = self._extract_tables(file_contents)
                
                # Then extract text
                with pdfplumber.open(pdf_file) as pdf:
                    for page in pdf.pages:
                        # Get page rotation angle
                        rotation = page.rotation or 0
                        
                        # Handle rotated pages
                        if rotation != 0:
                            # Rotate page to normal orientation
                            page = page.rotate(rotation)
                        
                        extracted = page.extract_text()
                        if extracted:
                            text += extracted + "\n"
                    
                    if text.strip():
                        logger.info("Successfully extracted text using pdfplumber")
                        return text.strip(), tables
                    else:
                        logger.info("No text found with pdfplumber, attempting OCR")
                        
            except Exception as e:
                logger.warning(f"pdfplumber extraction failed: {str(e)}")
                logger.info("Falling back to OCR")

            # If no text found or pdfplumber failed, try OCR
            try:
                # Convert PDF to images
                images = convert_from_bytes(
                    file_contents,
                    dpi=300,  # Higher DPI for better quality
                    fmt='jpeg',  # JPEG format for better OCR
                    grayscale=True  # Grayscale for better text recognition
                )
                
                if not images:
                    raise ValueError("No images could be extracted from PDF")

                logger.info(f"Successfully converted PDF to {len(images)} images")
                
                # Get list of available languages
                try:
                    available_langs = pytesseract.get_languages()
                    logger.info(f"Available OCR languages: {available_langs}")
                except:
                    available_langs = ['eng']
                
                # Perform OCR on each image
                text = ""
                for i, image in enumerate(images):
                    # Try multiple languages if available
                    for lang in ['eng', 'fil']:  # English and Filipino
                        if lang in available_langs:
                            page_text = pytesseract.image_to_string(
                                image,
                                lang=lang,
                                config='--psm 1 --oem 3'  # Automatic page segmentation with LSTM OCR
                            )
                            if page_text.strip():
                                text += page_text + "\n"
                                logger.info(f"Processed page {i+1} with OCR using language: {lang}")
                                break
                
                if text.strip():
                    logger.info("Successfully extracted text using OCR")
                    return text.strip(), tables
                else:
                    raise ValueError("OCR produced no text output")

            except Exception as e:
                logger.error(f"OCR processing failed: {str(e)}")
                raise

        except Exception as e:
            logger.error(f"Error in text extraction pipeline: {str(e)}")
            raise ValueError(f"Text extraction failed: {str(e)}")

        raise ValueError("No text could be extracted from the PDF")

    def _extract_product_name(self, raw_text: str) -> Optional[Tuple[str, float]]:
        """
        Heuristic product name extraction using early lines and signal scoring.
        Scoring features:
        - Position: earlier lines score higher
        - Capitalization: Title Case or ALL CAPS preferred
        - Length: 4..80 chars preferred
        - Signal words around: 'card', 'loan', 'account', 'product' in nearby lines
        - Penalize generic/legal/header lines
        """
        lines = [ln.strip() for ln in raw_text.split('\n')]
        # Consider only the first N lines to avoid body noise
        candidate_window = lines[:50]

        def alpha_ratio(s: str) -> float:
            letters = sum(c.isalpha() for c in s)
            return letters / max(1, len(s))

        def is_generic(s: str) -> bool:
            s_low = s.lower()
            generic_terms = [
                'table of contents', 'confidential', 'copyright', 'all rights reserved',
                'terms and conditions', 'page ', 'section ', 'rev.', 'version', 'updated',
                'applicant', 'application form', 'address', 'contact', 'email', 'website'
            ]
            return any(term in s_low for term in generic_terms)

        type_terms = ['card', 'loan', 'account', 'product', 'credit', 'savings', 'microfinance']
        best = None
        best_score = 0.0
        for idx, ln in enumerate(candidate_window):
            if len(ln) < 4 or len(ln) > 120:
                continue
            if alpha_ratio(ln) < 0.5:
                continue
            if is_generic(ln):
                continue
            # base
            score = 1.0
            # earlier line bonus
            score += max(0.0, 1.0 - (idx / 50.0))
            # capitalization bonus
            if ln.isupper():
                score += 0.5
            elif ln.istitle():
                score += 0.4
            # type proximity bonus (look at this and next 2 lines)
            neighborhood = ' '.join(candidate_window[idx:idx+3]).lower()
            if any(t in neighborhood for t in type_terms):
                score += 0.4
            # punctuation penalty if ends with colon/dot (likely a label)
            if ln.endswith(':') or ln.endswith('.'):
                score -= 0.2
            if score > best_score:
                best_score = score
                best = ln

        if best:
            # normalize whitespace but keep case
            name = re.sub(r'\s+', ' ', best).strip()
            # map score into 0..1 range roughly
            confidence = min(1.0, 0.5 + (best_score / 3.0))
            return name, confidence
        return None

    def extract_product_info(self, file_contents: bytes) -> Dict[str, Any]:
        """Extract product information from PDF"""
        # Extract text and tables
        raw_text, tables = self._extract_text_from_pdf(file_contents)
        if not raw_text:
            raise ValueError("Could not extract text from PDF")

        # Attempt robust name extraction BEFORE aggressive preprocessing
        name_guess = self._extract_product_name(raw_text)

        # Preprocess text (normalize spacing/dashes for downstream regex)
        text = self._preprocess_text(raw_text)

        # Split into sections
        sections = raw_text.split('\n\n') if '\n\n' in raw_text else text.split('\n\n')
        product_info = {
            "confidence_scores": {},
            "extracted_data": {}  # Store all extracted data before filtering
        }

        # Detect template and language
        template_type, template_confidence = self._detect_template(text)
        languages = self._detect_languages(text)
        
        logger.info(f"Detected template: {template_type} with confidence {template_confidence}")
        logger.info(f"Detected languages: {languages}")

        # Extract product name: prefer heuristic first, fall back to labeled patterns
        if name_guess:
            product_info['extracted_data']['name'] = name_guess[0]
            product_info['confidence_scores']['name'] = name_guess[1]
        else:
            for section in sections:
                name_matches = [
                    (r'product\s+name:?\s*(.+)', 0.85),
                    (r'name\s+of\s+product:?\s*(.+)', 0.85),
                    (r'^(?!table of contents)([A-Z][A-Za-z0-9\-\s]{3,80})$', 0.65),
                ]
                for pattern, confidence in name_matches:
                    name_match = re.search(pattern, section.strip(), re.IGNORECASE | re.MULTILINE)
                    if name_match:
                        name = self._preprocess_text(name_match.group(1))
                        if len(name) > 3:
                            product_info['extracted_data']['name'] = name
                            product_info['confidence_scores']['name'] = confidence
                            break
                if 'name' in product_info['extracted_data']:
                    break

        # Determine product type with confidence
        product_type, type_confidence = self._get_product_type(text)
        if product_type:
            product_info['extracted_data']['type'] = product_type
            product_info['confidence_scores']['type'] = type_confidence
            
            # Template matching boosts confidence
            if template_type and template_type == product_type.value.lower():
                product_info['confidence_scores']['type'] *= 1.2
                product_info['confidence_scores']['type'] = min(1.0, product_info['confidence_scores']['type'])

        # Extract amount ranges with currency
        amount_range = self._extract_amount_range(text)
        if amount_range:
            min_amount, max_amount, currency = amount_range
            product_info['extracted_data']['amount_range'] = {
                'min': min_amount,
                'max': max_amount,
                'currency': currency
            }
            
            # Cross-validate with tables
            table_amount = self._validate_amount_from_tables(tables, min_amount, max_amount)
            confidence = 0.9 if table_amount else 0.8
            product_info['confidence_scores']['amount_range'] = confidence

        # Extract tenure information with improved unit handling
        tenure_range = self._extract_tenure_range(text)
        if tenure_range:
            product_info['extracted_data']['tenure_range'] = {
                'min': tenure_range[0],
                'max': tenure_range[1],
                'unit': 'months'  # We convert everything to months
            }
            product_info['confidence_scores']['tenure_range'] = 0.9

        # Extract interest rate with APR normalization
        interest_rate = self._extract_interest_rate(text)
        if interest_rate:
            product_info['extracted_data']['interest_rate'] = {
                'min': interest_rate[0],
                'max': interest_rate[1],
                'type': 'APR'  # We normalize to APR
            }
            product_info['confidence_scores']['interest_rate'] = 0.85

        # Check for collateral requirement with context
        collateral_patterns = [
            (r'no\s+collateral\s+required', False, 0.95),
            (r'collateral\s+required', True, 0.9),
            (r'unsecured', False, 0.85),
        ]
        
        for pattern, value, confidence in collateral_patterns:
            if re.search(pattern, text.lower()):
                product_info['extracted_data']['collateral_required'] = value
                product_info['confidence_scores']['collateral_required'] = confidence
                break

        # Extract description with improved context
        product_info['extracted_data']['description'] = self._extract_description(text)
        product_info['confidence_scores']['description'] = 0.8

        # Extract target segments and demographics
        self._extract_target_segments(text, product_info)

        # Set default compliance status
        product_info['extracted_data']['compliance_status'] = ComplianceStatus.PENDING_REVIEW

        # Process extracted data for final output
        product_info = self._process_final_output(product_info)
        
        # Add metadata about extraction
        product_info['metadata'] = {
            'template_type': template_type,
            'template_confidence': template_confidence,
            'languages': languages,
            'table_count': len(tables)
        }

        return product_info

    def _extract_target_segments(self, text: str, product_info: Dict[str, Any]):
        """Extract target segments and demographics from text"""
        segment_patterns = {
            'Young Professionals': [r'young\s+professionals?', r'early\s+career'],
            'Students': [r'students?', r'education'],
            'Affluent': [r'affluent', r'high\s+net\s+worth', r'premium'],
            'Rural': [r'rural', r'farming', r'agriculture'],
            'Women': [r'women', r'female', r'gender'],
            'Senior Citizens': [r'senior\s+citizens?', r'elderly', r'retirees?'],
            'SME': [r'sme', r'small\s+business', r'entrepreneurs?']
        }
        
        found_segments = []
        for segment, patterns in segment_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text.lower()):
                    found_segments.append(segment)
                    break
        
        if found_segments:
            product_info['extracted_data']['target_segments'] = found_segments
            product_info['confidence_scores']['target_segments'] = 0.8

    def _validate_amount_from_tables(self, tables: List[Dict[str, Any]], min_amount: float, max_amount: float) -> bool:
        """Validate extracted amounts against table data"""
        for table in tables:
            # Look for amount-related columns
            amount_columns = []
            for col in table.get('columns', []):
                if any(term in col.lower() for term in ['amount', 'limit', 'loan', 'credit']):
                    amount_columns.append(col)
            
            # Check values in amount columns
            for col in amount_columns:
                values = [
                    float(str(val).replace(',', ''))
                    for row in table.get('data', [])
                    for val in [row.get(col)]
                    if val and isinstance(val, (int, float, str)) and re.match(r'^\d+[,.]?\d*$', str(val))
                ]
                
                if values:
                    table_min = min(values)
                    table_max = max(values)
                    
                    # Check if extracted values are within 20% of table values
                    min_diff = abs(table_min - min_amount) / table_min
                    max_diff = abs(table_max - max_amount) / table_max
                    
                    if min_diff <= 0.2 and max_diff <= 0.2:
                        return True
        
        return False

    def _process_final_output(self, product_info: Dict[str, Any]) -> Dict[str, Any]:
        """Process extracted data and create final output"""
        # Move validated data to top level
        final_info = {
            'confidence_scores': product_info['confidence_scores'],
            'metadata': product_info.get('metadata', {})
        }
        
        # Only include extracted data that meets confidence threshold
        for key, value in product_info['extracted_data'].items():
            if (key in product_info['confidence_scores'] and 
                product_info['confidence_scores'][key] >= self.confidence_threshold):
                final_info[key] = value
        
        return final_info

    def _extract_description(self, text: str) -> str:
        """
        Extract a meaningful description from the text with fallback tokenization
        """
        try:
            # Try NLTK's sentence tokenizer first
            sentences = sent_tokenize(text)
        except Exception as e:
            logger.warning(f"NLTK sentence tokenization failed: {str(e)}")
            # Get fallback tokenizer from __init__.py
            from . import get_fallback_tokenizer
            tokenizer = get_fallback_tokenizer()
            sentences = tokenizer(text)
        
        relevant_sentences = []
        excluded_terms = ['©', 'copyright', 'all rights reserved', 'confidential']
        
        for sentence in sentences[:3]:  # Take first few sentences
            sentence = sentence.strip()
            if len(sentence) > 20 and not any(x in sentence.lower() for x in excluded_terms):
                # Basic sentence validation
                if sentence[-1] in '.!?' and any(c.isupper() for c in sentence[:10]):
                    relevant_sentences.append(sentence)
        
        return ' '.join(relevant_sentences) if relevant_sentences else ""
