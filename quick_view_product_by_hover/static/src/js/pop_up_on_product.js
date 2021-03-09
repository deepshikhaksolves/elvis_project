odoo.define('quick_view_product_by_hover.popover_on_hover', function (require) {
    "use strict";

    var ListRenderer = require("web.ListRenderer");
    var rpc = require('web.rpc');
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
            if (self.state.model=='sale.order.line' || self.state.model=='account.move.line'){
                var $td = $(event.currentTarget);
                var $tr = $td.parent();
                var rowIndex = this.$('.o_data_row').index($tr);
                var last_inv_date = ''
                var last_inv_amount = 0
                var last_bill_date = ''
                var last_bill_amount = 0
                var total_on_hand_qty = 0
                var warehouse_on_hand_qty = []
                var  warehouse_available_qty = []
                if (self.state.data[rowIndex].data.id && self.state.model=='sale.order.line') {
                    rpc.query({
                               model: 'sale.order.line',
                               method: 'get_product_details',
                               args: [{
                                       'rec_id': self.state.data[rowIndex].data.id
                                       }]
                               },{async: false}).then(function (result) {
                                                            last_inv_date = result["last_inv_date"]
                                                            last_inv_amount = result["last_inv_currency"] + ' ' + result["last_inv_amount"]
                                                            last_bill_date = result["last_bill_date"]
                                                            last_bill_amount = result["last_bill_currency"] + ' ' + result["last_bill_amount"]
                                                            total_on_hand_qty = result['total_on_hand_qty']
                                                            warehouse_on_hand_qty = result['warehouse_on_hand_qty']
                                                            warehouse_available_qty = result['warehouse_available_qty']
                               self.$el.find('tbody').popover('dispose');
                               self.$el.find('tbody').popover(
                                   {
                                       animation: true,
                                       'content': function(e){
                                               return '<div style="height:100%; width:auto;"><h4 style="background-color: #DCDCDC;color: Black;">'+self.state.data[rowIndex].data.name+'</h4>'+
                                                       '<table>'+
                                                       ' <tr>'+
                                                           ' <td><b>Last Billed Date: </b></td>'+
                                                           ' <td>'+last_bill_date+'</td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td><b>Last Billed Price: </b></td>'+
                                                           ' <td>'+last_bill_amount+'</td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td><b>Last Invoice Date: </b></td>'+
                                                           ' <td>'+last_inv_date+'</td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td><b>Last Invoice Price: </b></td>'+
                                                           ' <td>'+last_inv_amount+'</td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td><b> Warehouse Qty: </b></td>'+
                                                           ' <td>'+
                                                               ' <div> <table>'+
                                                                   '<tr>'+
                                                                       ' <td>Warehouse 1 Name :</td>'+
                                                                       ' <td>'+ 1 +'</td>'+
                                                                   '</tr>'+
                                                                   '<tr>'+
                                                                       ' <td>Warehouse 2 Name :</td>'+
                                                                       ' <td>'+ 1 +'</td>'+
                                                                   '</tr>'+
                                                                   '<tr>'+
                                                                       ' <td>Warehouse 3 Name :</td>'+
                                                                       ' <td>'+ 1 +'</td>'+
                                                                   '</tr>'+
                                                               ' </table> </div>'+
                                                           ' </td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td> <b> Total Qty on Hand: </b></td>'+
                                                           ' <td>'+total_on_hand_qty+'</td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td><b>Warehouse Available Qty:</b></td>'+
                                                           ' <td>'+
                                                               ' <div> <table>'+
                                                                   '<tr>'+
                                                                       ' <td>Warehouse 1 Name :</td>'+
                                                                       ' <td>'+ 1 +'</td>'+
                                                                   '</tr>'+
                                                                   '<tr>'+
                                                                       ' <td>Warehouse 2 Name :</td>'+
                                                                       ' <td>'+ 1 +'</td>'+
                                                                   '</tr>'+
                                                                   '<tr>'+
                                                                       ' <td>Warehouse 3 Name :</td>'+
                                                                       ' <td>'+ 1 +'</td>'+
                                                                   '</tr>'+
                                                               ' </table> </div>'+
                                                           ' </td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td><b>Total Available Qty: </b></td>'+
                                                           ' <td>'+ self.state.data[rowIndex].data.qty_available_today +'</td>'+
                                                       ' </tr>'+
                                                       '</table></div>'
                                       },
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
                               method: 'get_product_details',
                               args: [{
                                       'rec_id': self.state.data[rowIndex].data.id
                                       }]
                               },{async: false}).then(function (result) {
                                                            last_inv_date = result["last_inv_date"]
                                                            last_inv_amount = result["last_inv_currency"] + ' ' + result["last_inv_amount"]
                                                            last_bill_date = result["last_bill_date"]
                                                            last_bill_amount = result["last_bill_currency"] + ' ' + result["last_bill_amount"]
                               self.$el.find('tbody').popover('dispose');
                               self.$el.find('tbody').popover(
                                   {
                                       animation: true,
                                       'content': function(e){
                                               return '<div style="height:100%; width:auto;"><h4 style="background-color: #DCDCDC;color: Black;">'+self.state.data[rowIndex].data.name+'</h4>'+
                                                       '<table>'+
                                                       ' <tr>'+
                                                           ' <td><b>Last Billed Date: </b></td>'+
                                                           ' <td>'+last_bill_date+'</td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td><b>Last Billed Price: </b></td>'+
                                                           ' <td>'+last_bill_amount+'</td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td><b>Last Invoice Date: </b></td>'+
                                                           ' <td>'+last_inv_date+'</td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td><b>Last Invoice Price: </b></td>'+
                                                           ' <td>'+last_inv_amount+'</td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td><b> Warehouse Qty: </b></td>'+
                                                           ' <td>'+
                                                               ' <div> <table>'+
                                                                   '<tr>'+
                                                                       ' <td>Warehouse 1 Name :</td>'+
                                                                       ' <td>'+ 1 +'</td>'+
                                                                   '</tr>'+
                                                                   '<tr>'+
                                                                       ' <td>Warehouse 2 Name :</td>'+
                                                                       ' <td>'+ 1 +'</td>'+
                                                                   '</tr>'+
                                                                   '<tr>'+
                                                                       ' <td>Warehouse 3 Name :</td>'+
                                                                       ' <td>'+ 1 +'</td>'+
                                                                   '</tr>'+
                                                               ' </table> </div>'+
                                                           ' </td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td> <b> Total Qty on Hand: </b></td>'+
                                                           ' <td>'+ 0 +'</td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td><b>Warehouse Available Qty:</b></td>'+
                                                           ' <td>'+
                                                               ' <div> <table>'+
                                                                   '<tr>'+
                                                                       ' <td>Warehouse 1 Name :</td>'+
                                                                       ' <td>'+ 1 +'</td>'+
                                                                   '</tr>'+
                                                                   '<tr>'+
                                                                       ' <td>Warehouse 2 Name :</td>'+
                                                                       ' <td>'+ 1 +'</td>'+
                                                                   '</tr>'+
                                                                   '<tr>'+
                                                                       ' <td>Warehouse 3 Name :</td>'+
                                                                       ' <td>'+ 1 +'</td>'+
                                                                   '</tr>'+
                                                               ' </table> </div>'+
                                                           ' </td>'+
                                                       ' </tr>'+
                                                       ' <tr>'+
                                                           ' <td><b>Total Available Qty: </b></td>'+
                                                           ' <td>'+ self.state.data[rowIndex].data.qty_available_today +'</td>'+
                                                       ' </tr>'+
                                                       '</table></div>'
                                       },
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
        },
        // Mouse removed out
        _on_not_hovering_mouse: function (event) {

            var self = this;

            if (self.state.model=='sale.order.line'){
                $('div.popover').remove();
            }
        },
    });
});