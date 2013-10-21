var MobileApp = MobileApp || {};
MobileApp.Model = Backbone.Model.extend({
    defaults: {
        first_name: "",
        last_name: "",
        dining_dt: "",
        guests: null,
        phoneNumber: null,
        email_addr: ""
    },
	urlRoot:"/users"

});



var makeReservation = new MobileApp.Model();

MobileApp.Collection = Backbone.Collection.extend({
    model: MobileApp.Model,
    url: "/reservations"
});

var reservations = new MobileApp.Collection();


MobileApp.ViewMakeReservation = Backbone.View.extend({
    el: $("#reservation-form"),
    model: MobileApp.Model,

    events: {
        "submit": "addReservation",
        "click #seeReservations": "seeReservations"
    },
    render: function () {
		return this;
		var that = this;
		var seeRes = new MobileApp.ViewSeeReservations();
		reservations.fetch({
			success: function(reservations){
				seeRes.render();
			}
		})
    },

	addReservation: function(e){
		var userDetails = $(e.currentTarget).serializeObject();
		var user = new MobileApp.Model();

		user.save(userDetails, {
			//success: function(user){
				//alert(user.toJSON());}
		});

		e.preventDefault();
		reservations.add(user);

        return reservations;
},
    seeReservations: function () {
        var seeReservations = new MobileApp.ViewSeeReservations({collection: reservations});
        return seeReservations;
    }
});

 $.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


MobileApp.ViewSeeReservations = Backbone.View.extend({
    el: $("#guestList ul"),
    template: _.template($("#template").html()),
    initialize: function () {
    $("#reservation-form").css("display", "block");
        this.$el.empty();
        this.render();
    },
    render: function () {
        _.each(reservations.models, function (i) {

            $("#guestList ul").append(this.template(i.attributes));
        }, this);
        return this;
    }
});

MobileApp.Router = Backbone.Router.extend({
    routes: {
    	"": "home",
        "index": "home",
        "guestList": "guests"
    },
    home: function () {
		$("#reservation-form").css("display", "block");
        $("#guestList").css("display", "none");
    },
    guests: function () {
        $("#reservation-form").css("display", "none");
        $("#guestList").css("display", "block");
    }
});

var reservationForm = new MobileApp.ViewMakeReservation();
var guests = new MobileApp.ViewSeeReservations();
var router = new MobileApp.Router();

router.on("route:home", function () {
        reservationForm.render();
    });
router.on("route:guestList", function () {
        guests.render();
    });
Backbone.history.start();
