# -*- coding: utf-8 -*-

from odoo import api, fields, models


class SaleOrderLineExtend(models.Model):
    _inherit = "sale.order.line"

    @api.model
    def get_product_details(self, vals):
        """This code fetches the details from last invoice."""
        # Sale order customer
        sol_obj = self.env['sale.order.line'].browse(vals['rec_id'])
        partner_id = sol_obj.order_partner_id.id
        product_id = sol_obj.product_id.id
        # get last invoice for this customer
        last_invoice = self.env['account.move.line'].search(
            [('partner_id', '=', partner_id), ('parent_state', '=', 'posted'),
             ('product_id', '=', product_id)], order="id desc").filtered(
            lambda inv_line: inv_line.move_id.move_type == 'out_invoice')[0]
        # get last billed details
        last_bill = self.env['account.move.line'].search(
            [('parent_state', '=', 'posted'), ('product_id', '=', product_id)], order="id desc").filtered(
            lambda inv_line: inv_line.move_id.move_type == 'in_invoice')[0]
        return {
            'last_inv_date': last_invoice.move_id.invoice_date,
            'last_inv_currency': last_invoice.currency_id.symbol,
            'last_inv_amount': last_invoice.price_total,
            'last_bill_date': last_bill.move_id.invoice_date,
            'last_bill_currency': last_bill.currency_id.symbol,
            'last_bill_amount': last_bill.price_total,
        }

