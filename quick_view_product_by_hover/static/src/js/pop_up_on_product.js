odoo.define('quick_view_product_by_hover.popover_on_hover', function (require) {
    "use strict";

    var ListRenderer = require("web.ListRenderer");
    //    for session
    var session = require('web.session');
    //    for getting value from function.
    var rpc = require('web.rpc');
    //    qweb for template calling
    var core = require ('web.core');
    var QWeb = core.qweb;
    ListRenderer.include({
        init: function () {
            this._super.apply(this, arguments);
        },
        events: _.extend({}, ListRenderer.prototype.events, {
            'mouseover tbody td.o_data_cell': '_on_hovering_mouse',
            'mouseout tbody td.o_data_cell': '_on_not_hovering_mouse',
        }),
        // Mouser Hover event for the Pop Over
        _on_hovering_mouse: function (event) {
            event.stopPropagation();
            event.preventDefault();
            var self = this;
            console.log('self', self)
            if ((self.state.model=='sale.order.line' && session.sale_enable_product_info)
            || (self.state.model=='account.move.line' && session.account_enable_product_info)
            || (self.state.model=='purchase.order.line' && session.purchase_enable_product_info)){
                var $td = $(event.currentTarget);
                var $tr = $td.parent();
                var rowIndex = this.$('.o_data_row').index($tr);
                var content
                if (self.state.data[rowIndex].data.product_id){
//                  Pop-up On sale order line records.
                    if (self.state.data[rowIndex].data.id && self.state.model=='sale.order.line') {
                        rpc.query({
                                   model: 'sale.order.line',
                                   method: 'get_product_details_from_sale_order_line',
                                   args: [{
                                           'rec_id': self.state.data[rowIndex].data.id
                                           }]
                                   },{async: false}).then(function (result) {
                                   content = QWeb.render('quick_view_product_by_hover.product_detail_template', {
                                   product_name :  self.state.data[rowIndex].data.name,
                                   last_bill_date: result["last_bill_date"],
                                   last_bill_amount: result["last_bill_currency"] + ' ' + result["last_bill_amount"],
                                   last_inv_date: result["last_inv_date"],
                                   last_inv_amount: result["last_inv_currency"] + ' ' + result["last_inv_amount"],
                                   total_on_hand: result['total_on_hand'],
                                   total_available: result['total_available'],
                                   warehouse_on_hand_qty: result['warehouse_on_hand_qty'],
                                   warehouse_available_qty: result['warehouse_available_qty'],
                                   });
                                   self.$el.find('tbody').popover('dispose');
                                   self.$el.find('tbody').popover(
                                       {
                                           animation: true,
                                           'content': function(e){
                                                   return content},
                                           'html': true,
                                           'placement':  function(c,s){
                                               return $(s).position().top < 200 ?'bottom':'top'
                                           },
                                           'trigger': 'hover',
                                       })
                                   self.$el.find('tbody').popover('show');
                        })
                    }
                     if (self.state.data[rowIndex].data.id && self.state.model=='account.move.line'){
                        rpc.query({
                                   model: 'account.move.line',
                                   method: 'get_product_details_from_account_move_line',
                                   args: [{
                                           'rec_id': self.state.data[rowIndex].data.id,
                                           'type': self.state.context.default_move_type
                                           }]
                                   },{async: false}).then(function (result) {
                                   content = QWeb.render('quick_view_product_by_hover.product_detail_template', {
                                   product_name :  self.state.data[rowIndex].data.name,
                                   last_bill_date: result["last_bill_date"],
                                   last_bill_amount: result["last_bill_currency"] + ' ' + result["last_bill_amount"],
                                   last_inv_date: result["last_inv_date"],
                                   last_inv_amount: result["last_inv_currency"] + ' ' + result["last_inv_amount"],
                                   total_on_hand: result['total_on_hand'],
                                   total_available: result['total_available'],
                                   warehouse_on_hand_qty: result['warehouse_on_hand_qty'],
                                   warehouse_available_qty: result['warehouse_available_qty'],
                                   });
                                   self.$el.find('tbody').popover('dispose');
                                   self.$el.find('tbody').popover(
                                       {
                                           animation: true,
                                           'content': function(e){
                                                   return content},
                                           'html': true,
                                           'placement':  function(c,s){
                                               return $(s).position().top < 200 ?'bottom':'top'
                                           },
                                           'trigger': 'hover',
                                       })
                                   self.$el.find('tbody').popover('show');
                                   })
                     }
                     if (self.state.data[rowIndex].data.id && self.state.model=='purchase.order.line'){
                                        rpc.query({
                                   model: 'purchase.order.line',
                                   method: 'get_product_details_from_purchase_order_line',
                                   args: [{
                                           'rec_id': self.state.data[rowIndex].data.id
                                           }]
                                   },{async: false}).then(function (result) {
                                   content = QWeb.render('quick_view_product_by_hover.product_detail_template', {
                                   product_name :  self.state.data[rowIndex].data.name,
                                   last_bill_date: result["last_bill_date"],
                                   last_bill_amount: result["last_bill_currency"] + ' ' + result["last_bill_amount"],
                                   last_inv_date: result["last_inv_date"],
                                   last_inv_amount: result["last_inv_currency"] + ' ' + result["last_inv_amount"],
                                   total_on_hand: result['total_on_hand'],
                                   total_available: result['total_available'],
                                   warehouse_on_hand_qty: result['warehouse_on_hand_qty'],
                                   warehouse_available_qty: result['warehouse_available_qty'],
                                   });
                                   self.$el.find('tbody').popover('dispose');
                                    self.$el.find('tbody').popover(
                                       {
                                           animation: true,
                                           'content': function(e){
                                                   return content},
                                           'html': true,
                                           'placement':  function(c,s){
                                               return $(s).position().top < 200 ?'bottom':'top'
                                           },
                                           'trigger': 'hover',
                                       })
                                   self.$el.find('tbody').popover('show');
                                   })
                     }
                }
            }
        },
        // Mouse removed out
        _on_not_hovering_mouse: function (event) {
            $('div.popover').remove();
        },
    });
});