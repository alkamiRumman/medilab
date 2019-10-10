$(function () {
    $(document).ajaxStart(function () {
        Pace.restart();
    });
    $.fn.inputFilter = function (inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    };
    $('body').on('change', '.custom-file-input', function () {
        var fileName = $(this).val();
        $(this).next('.custom-file-label').html(fileName);
    });
    "use strict";
    $('#to-recover').on("click", function () {
        $("#loginform").slideUp();
        $("#recoverform").fadeIn();
    });
    $('#from-recover').on("click", function () {
        $("#recoverform").slideUp();
        $("#loginform").fadeIn();
    });
    $(".preloader").fadeOut();
    $(document).on('click', '.mega-dropdown', function (e) {
        e.stopPropagation();
    });
    var set = function () {
        var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
        var topOffset = 70;
        if (width < 4170) {
            $("body").addClass("mini-sidebar");
            $('.navbar-brand span').hide();
            $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
            $(".sidebartoggler i").addClass("ti-menu");
        } else {
            $("body").removeClass("mini-sidebar");
            $('.navbar-brand span').show();
            //$(".sidebartoggler i").removeClass("ti-menu");
        }
        var height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
        if (window.innerWidth > 768) {
            height = height - topOffset;
        }
        if (height < 1) {
            height = 1;
        }
        if (height > topOffset) {
            $(".page-wrapper").css("min-height", (height) + "px");
        }
    };
    $(window).ready(set);
    $(window).on("resize", set);
    $(".sidebartoggler").on('click', function () {
        if ($("body").hasClass("mini-sidebar")) {
            $("body").trigger("resize");
            $(".scroll-sidebar, .slimScrollDiv").css("overflow", "hidden").parent().css("overflow", "visible");
            $("body").removeClass("mini-sidebar");
            $('.navbar-brand span').show();
            //$(".sidebartoggler i").addClass("ti-menu");
        } else {
            $("body").trigger("resize");
            $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
            $("body").addClass("mini-sidebar");
            $('.navbar-brand span').hide();
            //$(".sidebartoggler i").removeClass("ti-menu");
        }
    });
    if ($.fn.stick_in_parent) {
        $(".fix-header .topbar").stick_in_parent({});
    }
    $(".nav-toggler").click(function () {
        $("body").toggleClass("show-sidebar");
        $(".nav-toggler i").toggleClass("ti-menu");
        $(".nav-toggler i").addClass("ti-close");
    });
    $(".sidebartoggler").on('click', function () {
        //$(".sidebartoggler i").toggleClass("ti-menu");
    });
    if ($('#sidebarnav').html() !== undefined) {
        $('#sidebarnav').metisMenu();
    }
    if ($.fn.daterangepicker) {
        $(".currentDateTime").daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: true,
            locale: {
                format: globalSetting.settings.dateTimeFormat
            },
            startDate: new Date()
        });
        $(".currentDate").daterangepicker({
            singleDatePicker: true,
            timePicker: false,
            showDropdowns: true,
            locale: {
                format: globalSetting.settings.dateFormat
            },
            startDate: new Date()
        });
    }
    if ($.fn.bootstrapSwitch) {
        $.extend(true, $.fn.bootstrapSwitch.defaults, {
            onColor: " bg-theme",
            offColor: " bg-danger",
            wrapperClass: " text-white mt-2"
        });
        $('[data-toggle="switch"]').bootstrapSwitch();
    }
    $('[data-toggle="tooltip"]').tooltip();
    $('[title]').tooltip();
    var popOverSettings = {
        container: 'body',
        html: true,
        placement: "top",
        selector: '[data-toggle="popover"]'
    };
    $('body').popover(popOverSettings);
    window.onclick = function (e) {
        /*if ($(e.target).hasClass("pop-close")) {
            $(e.target).closest("div.popover").popover("hide");
        }*/
    };
    $('.scroll-sidebar').slimScroll({
        position: 'left',
        size: "5px",
        height: '100%',
        color: '#dcdcdc'
    });
    $("body").trigger("resize");
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-bottom-full-width",
        //positionClass: "toast-bottom-left",
        preventDuplicates: false,
        onclick: null,
        showDuration: "1000",
        hideDuration: "1000",
        timeOut: "10000",
        extendedTimeOut: "5000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
    addAsterisk();

    ///
    let url = window.location;
    let element = $('ul#sidebarnav a').filter(function () {
        return this.href === url.href;
    }).addClass('active').parent().addClass('active');
    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent().addClass('active');
        } else {
            break;
        }
    }
});

function addAsterisk() {
    $("textarea,input,select").each(function (index, elm) {
        let $element = $(elm);
        if (elm.hasAttribute("required")) {
            let $label = $('label[for="' + $element.attr("id") + '"]');
            if ($label.html() !== undefined) {
                if ($label.html().toString().indexOf('<strong class="text-info">*</strong>') < 0) {
                    $label.append(" <strong class='text-info'>*</strong>");
                }
            }
        }
    });
}