# -*- coding: utf-8 -*-
{
    'name': "Quick View Product By Hover",

    'summary': """
    This app is used to get product details in sale order and purchase order.
    """,

    'description': """   
    """,
    'author': "Ksolves",
    'website': "http://www.ksolves.com",
    'category': 'Accounts',
    'version': '14.0.0.1',
    'depends': ['sale_management', 'purchase', 'account'],
    'data': [
        'views/res_config_settings_view.xml',
        'views/assets.xml',
    ],
    'installable': True,
    'application': True,
    'sequence': 1,
}
