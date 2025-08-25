# Services module
import os
import logging
import nltk
from typing import List, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set NLTK data path to be local to the project
nltk_data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'nltk_data')
os.makedirs(nltk_data_dir, exist_ok=True)
nltk.data.path.insert(0, nltk_data_dir)

# Define all possible NLTK data resources we might need
NLTK_RESOURCES = {
    'tokenizers': [
        'punkt',
        'punkt_tab'
    ],
    'corpora': [
        'stopwords',
        'words',
        'wordnet',
        'omw-1.4'
    ],
    'taggers': [
        'averaged_perceptron_tagger'
    ],
    'chunkers': [
        'maxent_ne_chunker'
    ]
}

def download_nltk_resource(resource_type: str, resource_name: str) -> bool:
    """
    Download a specific NLTK resource with error handling
    """
    try:
        # Try to find the resource first
        try:
            if resource_type == 'tokenizers':
                nltk.data.find(f'{resource_type}/{resource_name}')
            else:
                nltk.data.find(f'{resource_type}/{resource_name}.zip')
        except LookupError:
            # Resource not found, download it
            logger.info(f"Downloading NLTK resource: {resource_type}/{resource_name}")
            nltk.download(resource_name, download_dir=nltk_data_dir, quiet=True)
            return True
            
    except Exception as e:
        logger.warning(f"Failed to download {resource_type}/{resource_name}: {str(e)}")
        return False
    
    return True

def get_fallback_tokenizer() -> Optional[callable]:
    """
    Get a fallback tokenizer if NLTK's punkt is not available
    """
    def simple_tokenize(text: str) -> List[str]:
        # Simple period-based sentence tokenization with some basic rules
        text = text.replace('?', '.')
        text = text.replace('!', '.')
        sentences = text.split('.')
        return [s.strip() for s in sentences if s.strip()]
    
    return simple_tokenize

def initialize_nltk():
    """Initialize NLTK by downloading required data packages with fallbacks"""
    success = True
    
    for resource_type, resources in NLTK_RESOURCES.items():
        for resource in resources:
            if not download_nltk_resource(resource_type, resource):
                success = False
                logger.warning(f"Failed to download {resource_type}/{resource}")
    
    if success:
        logger.info("NLTK data initialization complete")
    else:
        logger.warning("Some NLTK resources could not be downloaded. Basic functionality will still work.")

# Initialize NLTK when the module is imported
initialize_nltk()