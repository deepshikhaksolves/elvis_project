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
        last_product_invoices = customer_last_invoices.mapped('line_ids').filtered(
            lambda inv_line: inv_line.product_id == product_id)
        # product_id.id in customer_last_invoices.mapped('line_ids').mapped('product_id').ids
        # get last billed details
        last_bills = self.env['account.move'].search(
            [('partner_id', '=', partner_id), ('state', '=', 'posted'),
             ('move_type', '=', 'in_invoice')], order="invoice_date desc")
        last_product_bills = last_bills.mapped('line_ids').filtered(
            lambda inv_line: inv_line.product_id == product_id)
        # stock location without parent location
        locations = self.env['stock.location'].search([('location_id', '=', None)])
        warehouse_qty_on_hand = []
        warehouse_available_qty = []
        for each_loc in locations:
            on_hand_qty = 0
            available_qty = 0
            qty = self.env['stock.quant'].read_group(
                [('location_id', 'child_of', each_loc.id)],
                ['available_quantity: sum(available_quantity)',
                 'quantity: sum(quantity)'],
                ['product_id'])
            if qty:
                on_hand_qty = qty[0]['quantity']
            warehouse_qty_on_hand.append({'name': each_loc.name,
                                          'qty': on_hand_qty})
            warehouse_available_qty.append({'name': each_loc.name,
                                            'qty': available_qty})

        return {
            'last_inv_date': last_product_invoices[0].move_id.invoice_date if last_product_invoices else '',
            'last_inv_currency': last_product_invoices[0].currency_id.symbol if last_product_invoices else '',
            'last_inv_amount': last_product_invoices[0].price_unit if last_product_invoices else 0,
            'last_bill_date': last_product_bills[0].move_id.invoice_date if last_product_bills else '',
            'last_bill_currency': last_product_bills[0].currency_id.symbol if last_product_bills else '',
            'last_bill_amount': last_product_bills[0].price_unit if last_product_bills else 0,
            'total_on_hand_qty': product_id.qty_available,
            'warehouse_on_hand_qty': warehouse_qty_on_hand,
            'warehouse_available_qty': warehouse_available_qty,
        }
