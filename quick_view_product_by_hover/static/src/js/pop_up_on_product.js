odoo.define('quick_view_product_by_hover.popover_on_hover', function (require) {
    "use strict";
    var ListRenderer = require("web.ListRenderer");
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
                console.log("self", self);


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
                                        ' <td>Delivered Qty:</td>'+
                                        ' <td>'+ self.state.data[rowIndex].data.qty_delivered +'</td>'+
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