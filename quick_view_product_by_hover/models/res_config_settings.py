# -*- coding: utf-8 -*-

from odoo import api, fields, models


class ResConfigSettingsExtend(models.TransientModel):
    _inherit = "res.config.settings"

    purchase_enable_product_info = fields.Boolean(string="Enable Product Info")
    sale_enable_product_info = fields.Boolean(string="Enable Product Info")
    account_enable_product_info = fields.Boolean(string="Enable Product Info")

    @api.model
    def get_values(self):
        res = super(ResConfigSettingsExtend, self).get_values()
        icp = self.env['ir.config_parameter'].sudo()
        res.update(
            purchase_enable_product_info=icp.get_param('purchase_enable_product_info'),
            sale_enable_product_info=icp.get_param('sale_enable_product_info'),
            account_enable_product_info=icp.get_param('account_enable_product_info'),
        )
        return res

    def set_values(self):
        super(ResConfigSettingsExtend, self).set_values()
        self.env['ir.config_parameter'].sudo().set_param('purchase_enable_product_info',
                                                         self.purchase_enable_product_info)
        self.env['ir.config_parameter'].sudo().set_param('sale_enable_product_info',
                                                         self.sale_enable_product_info)
        self.env['ir.config_parameter'].sudo().set_param('ks_crm.account_enable_product_info',
                                                         self.account_enable_product_info)