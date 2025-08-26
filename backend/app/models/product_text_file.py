from datetime import datetime
from mongoengine import (
    Document,
    ReferenceField,
    StringField,
    DateTimeField,
    IntField,
)
from .product import Product


class ProductTextFile(Document):
    product = ReferenceField(Product, required=True, reverse_delete_rule=2)
    filename = StringField(required=True)
    content_type = StringField(default="application/pdf")
    size = IntField()
    uploaded_at = DateTimeField(default=datetime.utcnow)

    # Textual representation extracted from the file
    text = StringField(required=True)

    meta = {
        'collection': 'product_files',
        'indexes': [
            'product',
            'uploaded_at',
        ]
    }


