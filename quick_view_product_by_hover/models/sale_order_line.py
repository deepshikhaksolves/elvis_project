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
        product_id = sol_obj.product_id
        # get last invoice for this customer
        customer_last_invoices = self.env['account.move'].search(
            [('partner_id', '=', partner_id), ('state', '=', 'posted'),
             ('move_type', '=', 'out_invoice')], order="invoice_date desc")
        last_product_invoices = customer_last_invoices.filtered(
            lambda inv: inv.line_ids.product_id == product_id)
        # get last billed details
        last_bills = self.env['account.move'].search(
            [('partner_id', '=', partner_id), ('state', '=', 'posted'),
             ('move_type', '=', 'in_invoice')], order="invoice_date desc")
        last_product_bills = last_bills.filtered(
            lambda inv: inv.line_ids.product_id == product_id)
        return {
            'last_inv_date': last_product_invoices[0].invoice_date if last_product_invoices else '',
            'last_inv_currency': last_product_invoices[0].currency_id.symbol if last_product_invoices else '',
            'last_inv_amount': last_product_invoices[0].line_ids.filtered(
                lambda inv_line: inv_line.product_id == product_id).price_total if last_product_invoices else 0,
            'last_bill_date': last_product_bills[0].invoice_date if last_product_bills else '',
            'last_bill_currency': last_product_bills[0].currency_id.symbol if last_product_bills else '',
            'last_bill_amount': last_product_invoices[0].line_ids.filtered(
                lambda inv_line: inv_line.product_id == product_id).price_total if last_product_bills else 0,
        }