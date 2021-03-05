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
            if (self.state.model=='sale.order.line'){
                var $td = $(event.currentTarget);
                var $tr = $td.parent();
                var rowIndex = this.$('.o_data_row').index($tr);
                console.log("self", self.state.data[rowIndex].data.id);
                var last_inv_date = ''
                var last_inv_amount = 0
                var last_bill_date = ''
                var last_bill_amount = 0
                if (self.state.data[rowIndex].data.id){
                    rpc.query({
                               model: 'sale.order.line',
                               method: 'get_product_details',
                               args: [{
                                       'rec_id': self.state.data[this.$('.o_data_row').index($tr)].data.id
                                       }]
                               }).then(function (result) {
                                                            last_inv_date = result["last_inv_date"]
                                                            last_inv_amount = result["last_inv_currency"] + ' ' + result["last_inv_amount"]
                                                            last_bill_date = result["last_bill_date"]
                                                            last_bill_amount = result["last_bill_currency"] + ' ' + result["last_bill_amount"]
                                                            });
                this.$el.find('tbody').popover('dispose');
                this.$el.find('tbody').popover(
                    {
                        animation: true,
                        'content': function(e){
                                return '<div style="height:100%; width:auto;"><h4 style="background-color: #DCDCDC;color: Black;">'+self.state.data[rowIndex].data.name+'</h4>'+
                                        '<table>'+
                                        ' <tr>'+
                                        ' <td>Ordered Qty:</td>'+
                                        ' <td>'+ self.state.data[rowIndex].data.product_uom_qty +'</td>'+
                                        ' </tr>'+
                                        '<tr>'+
                                        ' <td>Last Invoice Date: </td>'+
                                        ' <td>'+ last_inv_date +'</td>'+
                                        ' </tr>'+
                                        '<tr>'+
                                        ' <td>Last Invoice Price:</td>'+
                                        ' <td>'+ last_inv_amount +'</td>'+
                                        ' </tr>'+
                                        ' <td>Last Invoice Date: </td>'+
                                        ' <td>'+ last_bill_date +'</td>'+
                                        ' </tr>'+
                                        '<tr>'+
                                        ' <td>Last Invoice Price:</td>'+
                                        ' <td>'+ last_bill_amount +'</td>'+
                                        ' </tr>'+
                                        '<tr>'+
                                        ' <td>Total quantity available:</td>'+
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
                this.$el.find('tbody').popover('show');
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