from datetime import datetime

from database.db import db


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    total_price = db.Column(
        db.Float,
        nullable=False,
        default=0
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="pending"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # Relasi ke User
    user = db.relationship(
        "User",
        backref=db.backref(
            "orders",
            lazy=True
        )
    )

    # Relasi ke OrderItem
    items = db.relationship(
        "OrderItem",
        backref="order",
        lazy=True,
        cascade="all, delete-orphan"
    )