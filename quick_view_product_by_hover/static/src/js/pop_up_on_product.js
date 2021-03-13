odoo.define('quick_view_product_by_hover.popover_on_hover', function (require) {
    "use strict";

    //    For session
    var session = require('web.session');
    //    For getting value from function.
    var rpc = require('web.rpc');
    //    qweb for template calling
    var core = require ('web.core');
    var QWeb = core.qweb;
    //    Many2one field
    var fieldRegistry = require('web.field_registry');
    var FieldMany2One = require('web.relational_fields').FieldMany2One;

    var ProductHoverWidget = FieldMany2One.extend({
        init: function () {
            this._super.apply(this, arguments);
        },
        events: _.extend({}, FieldMany2One.prototype.events, {
            'mouseover': '_on_hovering_mouse',
            'mouseout': '_on_not_hovering_mouse',
        }),
        // Mouser Hover event for the Pop Over
        _on_hovering_mouse: function (event) {
            event.stopPropagation();
            event.preventDefault();
            var self = this;
            if ((self.model=='sale.order.line' && session.sale_enable_product_info)
            || (self.model=='account.move.line' && session.account_enable_product_info)
            || (self.model=='purchase.order.line' && session.purchase_enable_product_info)){
                var content = false
                var product_id = self.record.data.product_id;
                if (product_id.res_id){
//                  Pop-up On sale order line records.
                    if (self.res_id && (self.model =="sale.order.line" || self.model =="purchase.order.line")) {
                        rpc.query({
                                   model: self.model,
                                   method: 'get_product_details',
                                   args: [{
                                           'rec_id': self.res_id
                                           }]
                                   },{async: false}).then(function (result) {
                                   content = QWeb.render('quick_view_product_by_hover.product_detail_template', {
                                   product_name :  product_id.data.display_name,
                                   last_bill_date: result["last_bill_date"],
                                   last_bill_amount: result["last_bill_currency"] + ' ' + result["last_bill_amount"],
                                   last_inv_date: result["last_inv_date"],
                                   last_inv_amount: result["last_inv_currency"] + ' ' + result["last_inv_amount"],
                                   total_on_hand: result['total_on_hand'],
                                   total_available: result['total_available'],
                                   warehouse_on_hand_qty: result['warehouse_on_hand_qty'],
                                   warehouse_available_qty: result['warehouse_available_qty'],
                                   });
                                   self.$el.popover('dispose');
                                   if (content){
                                        self.$el.popover(
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
                                        self.$el.popover('show');
                                   }
                        })
                    }
                     if (self.res_id && self.model=="account.move.line"){
                        rpc.query({
                                   model: self.model,
                                   method: 'get_product_details_from_account_move_line',
                                   args: [{
                                           'rec_id': self.res_id,
                                           'type': self.record.context.default_move_type
                                           }]
                                   },{async: false}).then(function (result) {
                                   content = QWeb.render('quick_view_product_by_hover.product_detail_template', {
                                   product_name :  product_id.data.display_name,
                                   last_bill_date: result["last_bill_date"],
                                   last_bill_amount: result["last_bill_currency"] + ' ' + result["last_bill_amount"],
                                   last_inv_date: result["last_inv_date"],
                                   last_inv_amount: result["last_inv_currency"] + ' ' + result["last_inv_amount"],
                                   total_on_hand: result['total_on_hand'],
                                   total_available: result['total_available'],
                                   warehouse_on_hand_qty: result['warehouse_on_hand_qty'],
                                   warehouse_available_qty: result['warehouse_available_qty'],
                                   });
                                   self.$el.popover('dispose');
                                   if (content){
                                        self.$el.popover(
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
                                        self.$el.popover('show');
                                    }
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
    fieldRegistry.add('product_details_on_hover', ProductHoverWidget);
});