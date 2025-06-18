from marshmallow import Schema, fields, validate, ValidationError, pre_load
from decimal import Decimal
import re

class ProductoSchema(Schema):
    nombre = fields.Str(required=True, validate=validate.Length(min=2, max=150))
    categoria = fields.Str(required=True, validate=validate.OneOf(['frutas', 'verduras', 'otros']))
    unidad = fields.Str(validate=validate.OneOf(['kg', 'unidad', 'litro', 'gramo']), missing='kg')
    stock_actual = fields.Decimal(validate=validate.Range(min=0), missing=0)
    stock_minimo = fields.Decimal(validate=validate.Range(min=0), missing=0)
    precio_unitario = fields.Decimal(required=True, validate=validate.Range(min=0.01))
    precio_compra = fields.Decimal(validate=validate.Range(min=0), allow_none=True)
    codigo_barras = fields.Str(validate=validate.Length(max=50), allow_none=True)
    descripcion = fields.Str(validate=validate.Length(max=500), missing='')
    proveedor_id = fields.Int(validate=validate.Range(min=1), allow_none=True)
    
    @pre_load
    def sanitize_data(self, data, **kwargs):
        """Sanitizar datos de entrada"""
        if isinstance(data.get('nombre'), str):
            data['nombre'] = data['nombre'].strip()
        if isinstance(data.get('descripcion'), str):
            data['descripcion'] = data['descripcion'].strip()
        if isinstance(data.get('codigo_barras'), str):
            data['codigo_barras'] = data['codigo_barras'].strip() or None
        return data

class UsuarioSchema(Schema):
    nombre = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    correo = fields.Email(required=True, validate=validate.Length(max=150))
    password = fields.Str(required=True, validate=validate.Length(min=6, max=128))
    rol = fields.Str(validate=validate.OneOf(['admin', 'operador', 'cajero']), missing='operador')
    
    @pre_load
    def sanitize_data(self, data, **kwargs):
        """Sanitizar datos de entrada"""
        if isinstance(data.get('nombre'), str):
            data['nombre'] = data['nombre'].strip()
        if isinstance(data.get('correo'), str):
            data['correo'] = data['correo'].strip().lower()
        return data

class VentaSchema(Schema):
    cliente_id = fields.Int(validate=validate.Range(min=1), allow_none=True)
    forma_pago = fields.Str(validate=validate.OneOf(['efectivo', 'tarjeta', 'transferencia', 'credito']), missing='efectivo')
    subtotal = fields.Decimal(required=True, validate=validate.Range(min=0))
    descuento = fields.Decimal(validate=validate.Range(min=0), missing=0)
    impuestos = fields.Decimal(validate=validate.Range(min=0), missing=0)
    total = fields.Decimal(required=True, validate=validate.Range(min=0.01))
    observaciones = fields.Str(validate=validate.Length(max=500), missing='')
    productos = fields.List(fields.Dict(), required=True, validate=validate.Length(min=1))

def validate_data(schema_class, data):
    """Función helper para validar datos"""
    schema = schema_class()
    try:
        return schema.load(data), None
    except ValidationError as e:
        return None, e.messages

def sanitize_sql_input(value):
    """Sanitizar entrada SQL básica"""
    if isinstance(value, str):
        # Remover caracteres peligrosos
        dangerous_chars = ['--', ';', '/*', '*/', 'xp_', 'sp_']
        for char in dangerous_chars:
            value = value.replace(char, '')
        return value.strip()
    return value