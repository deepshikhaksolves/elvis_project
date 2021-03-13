# -*- coding: utf-8 -*-

from odoo import api, fields, models


class AccountMoveLineExtend(models.Model):
    _inherit = "account.move.line"

    @api.model
    def get_product_details_from_account_move_line(self, vals):
        """This code fetches all the data and show pop-up in account.move.line."""
        inv_line_obj = self.env['account.move.line'].browse(vals['rec_id'])
        type = vals['type']
        partner_id = inv_line_obj.partner_id.id
        product_id = inv_line_obj.product_id
        last_product_invoices = False
        last_product_bills = False
        # This code fetches all the data and show pop-up in credit note and customer invoice.
        if type == "out_invoice" or type == "out_refund":
            # get last invoice for this customer
            customer_last_invoices = self.env['account.move'].search(
                [('partner_id', '=', partner_id), ('state', '=', 'posted'),
                 ('move_type', '=', 'out_invoice')], order="invoice_date desc")
            last_product_invoices = customer_last_invoices.mapped('line_ids').filtered(
                lambda inv_line: inv_line.product_id == product_id)
            # get last billed details
            last_bills = self.env['account.move'].search(
                [('state', '=', 'posted'), ('move_type', '=', 'in_invoice')],
                order="invoice_date desc")
            last_product_bills = last_bills.mapped('line_ids').filtered(
                lambda inv_line: inv_line.product_id == product_id)
        # This code fetches all the data and show pop-up in refunds and vendor bill.
        if type == "in_invoice" or type == "in_refund":
            # get last invoice for this customer
            customer_last_invoices = self.env['account.move'].search(
                [('state', '=', 'posted'), ('move_type', '=', 'out_invoice')],
                order="invoice_date desc")
            last_product_invoices = customer_last_invoices.mapped('line_ids').filtered(
                lambda inv_line: inv_line.product_id == product_id)
            # get last billed details
            last_bills = self.env['account.move'].search(
                [('partner_id', '=', partner_id), ('state', '=', 'posted'),
                 ('move_type', '=', 'in_invoice')], order="invoice_date desc")
            last_product_bills = last_bills.mapped('line_ids').filtered(
                lambda inv_line: inv_line.product_id == product_id)
        # get on hand quantity and available quantity 's details
        warehouse_qty_on_hand = []
        warehouse_available_qty = []
        total_on_hand = 0
        total_available = 0
        for each_company in self.env.company:
            onhand_stock = self.env['stock.quant'].search([('company_id', '=', each_company.id),
                                                           ('product_id', '=', product_id.id),
                                                           ('on_hand', '=', True)])
            if onhand_stock:
                for each_location_onhand_stock in onhand_stock:
                    warehouse_qty_on_hand.append({'name': each_location_onhand_stock.location_id.display_name,
                                                  'qty': each_location_onhand_stock.quantity})
                    warehouse_available_qty.append({'name': each_location_onhand_stock.location_id.display_name,
                                                    'qty': each_location_onhand_stock.available_quantity})
                    total_on_hand += each_location_onhand_stock.quantity
                    total_available += each_location_onhand_stock.available_quantity
        return {
            'last_inv_date': last_product_invoices[0].move_id.invoice_date if last_product_invoices else '',
            'last_inv_currency': last_product_invoices[0].currency_id.symbol if last_product_invoices else '',
            'last_inv_amount': last_product_invoices[0].price_unit if last_product_invoices else 0,
            'last_bill_date': last_product_bills[0].move_id.invoice_date if last_product_bills else '',
            'last_bill_currency': last_product_bills[0].currency_id.symbol if last_product_bills else '',
            'last_bill_amount': last_product_bills[0].price_unit if last_product_bills else 0,
            'total_on_hand': total_on_hand,
            'total_available': total_available,
            'warehouse_on_hand_qty': warehouse_qty_on_hand,
            'warehouse_available_qty': warehouse_available_qty,
        }