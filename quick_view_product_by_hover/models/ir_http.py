# -*- coding: utf-8 -*-

from odoo import models
from odoo.http import request


class IrHttpExtend(models.AbstractModel):
    _inherit = 'ir.http'

    # To set Config parameter value to the session.
    def session_info(self):
        res = super(IrHttpExtend, self).session_info()
        res['purchase_enable_product_info'] = self.env['ir.config_parameter'].sudo().get_param(
            'purchase_enable_product_info')
        res['sale_enable_product_info'] = self.env['ir.config_parameter'].sudo().get_param(
            'sale_enable_product_info')
        res['account_enable_product_info'] = self.env['ir.config_parameter'].sudo().get_param(
            'account_enable_product_info')
        return res