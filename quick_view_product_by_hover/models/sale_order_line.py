# -*- coding: utf-8 -*-

from odoo import api, fields, models


class SaleOrderLineExtend(models.Model):
    _inherit = "sale.order.line"

    @api.model
    def get_product_details_from_sale_order_line(self, vals):
        """This code fetches all the data and show pop-up in sale-order."""
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
        # get last billed details
        last_bills = self.env['account.move'].search(
            [('state', '=', 'posted'),('move_type', '=', 'in_invoice')],
            order="invoice_date desc")
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
                [('product_id', '=', product_id.id), ('on_hand', '=', True)],
                ['available_quantity: sum(available_quantity)','quantity: sum(quantity)'],
                ['product_id'])
            if qty:
                # quantity = qty.filtered(lambda stock_quant: stock_quant.location_id.company_id = self.user.company_ids.ids)
                on_hand_qty = qty[0]['quantity']
                # available_qty = qty[0]['available_quantity']
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


    def action_open_quants(self):
        domain = [('product_id', 'in', self.ids)]
        hide_location = not self.user_has_groups('stock.group_stock_multi_locations')
        hide_lot = all(product.tracking == 'none' for product in self)
        self = self.with_context(
            hide_location=hide_location, hide_lot=hide_lot,
            no_at_date=True, search_default_on_hand=True,
        )

        # If user have rights to write on quant, we define the view as editable.
        if self.user_has_groups('stock.group_stock_manager'):
            self = self.with_context(inventory_mode=True)
            # Set default location id if multilocations is inactive
            if not self.user_has_groups('stock.group_stock_multi_locations'):
                user_company = self.env.company
                warehouse = self.env['stock.warehouse'].search(
                    [('company_id', '=', user_company.id)], limit=1
                )
                if warehouse:
                    self = self.with_context(default_location_id=warehouse.lot_stock_id.id)
        # Set default product id if quants concern only one product
        if len(self) == 1:
            self = self.with_context(
                default_product_id=self.id,
                single_product=True
            )
        else:
            self = self.with_context(product_tmpl_ids=self.product_tmpl_id.ids)
        action = self.env['stock.quant']._get_quants_action(domain)
        action["name"] = _('Update Quantity')
        return action
