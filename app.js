var MobileApp = MobileApp || {};
MobileApp.Model = Backbone.Model.extend({
    defaults: {
        firstName: "",
        lastName: "",
        date: "",
        guestsNumber: null,
        phoneNumber: null,
        email: ""
    }
});

var makeReservation = new MobileApp.Model();

MobileApp.Collection = Backbone.Collection.extend({
    model: MobileApp.Model,
    url: "/reservations",
    localStorage: new Backbone.LocalStorage("reservations")
});

var reservations = new MobileApp.Collection();


MobileApp.ViewMakeReservation = Backbone.View.extend({
    el: $("#reservation-form"),
    model: MobileApp.Model,
    initialize: function () {
        var that = this;
        reservations.bind("add", function () {
            that.render();
        });
    },
    events: {
        "click #submit": "addReservation",
        "click #seeReservations": "seeReservations"
    },
    render: function () {
        return this;
    },
    addReservation: function (e) {
        var that = this;
        if (e) {
            e.preventDefault();
        }

        makeReservation = {
            firstName: $("#first_name").val(),
            lastName: $("#last_name").val(),
            date: $("#dining_dt").val(),
            guestsNumber: $("#guests").val(),
            phoneNumber: $("#phone").val(),
            email: $("#email_addr").val()
        };
        reservations.add(makeReservation);

        return reservations;
    },
    seeReservations: function (e) {
        var seeReservations = new MobileApp.ViewSeeReservations({
            collection: reservations
        });
        return seeReservations;
    }
});
var reservationForm = new MobileApp.ViewMakeReservation();

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
            $("#guestList ul").append(this.template(i.toJSON()));
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

var router = new MobileApp.Router();
router.on("route:guests", function () {
    router.guests();
});
router.on("route:home", function () {
    router.home();
});
Backbone.history.start();
