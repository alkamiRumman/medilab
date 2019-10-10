$(function () {
    if (notifications !== undefined) {
        notifications.forEach(function (notification) {
            toastr[notification.type](Array.isArray(notification.message) ? notification.message.join("<br>") : notification.message, notification.title);
        });
    }

    let dataTableStartTime = new Date().valueOf();
    if ($.fn.dataTable) {
        $.extend(true, $.fn.dataTable.defaults, {
            order: [0, "ASC"],
            dom: '<"row"<"col"B><"col-auto"l>>rtip',
            autoWidth: false,
            search: {
                regex: true
            },
            buttons: ['colvis',
                {
                    extend: 'collection',
                    text: 'Export Selected',
                    buttons: [
                        {
                            extend: 'csv',
                            text: 'Export as Csv [All]',
                            exportOptions: {
                                columns: ':visible'
                            }
                        },
                        {
                            extend: 'csv',
                            text: 'Export as Csv [Selected]',
                            exportOptions: {
                                columns: ':visible',
                                modifier: {
                                    selected: true
                                }
                            },
                        },
                        {
                            extend: 'excel',
                            text: 'Export as Excel [All]',
                            exportOptions: {
                                columns: ':visible'
                            }
                        },
                        {
                            extend: 'excel',
                            text: 'Export as Excel [Selected]',
                            exportOptions: {
                                columns: ':visible',
                                modifier: {
                                    selected: true
                                }
                            },
                        },
                        {
                            extend: 'pdf',
                            text: 'Export as PDF [All]',
                            exportOptions: {
                                columns: ':visible'
                            }
                        },
                        {
                            extend: 'pdf',
                            text: 'Export as PDF [Selected]',
                            exportOptions: {
                                columns: ':visible',
                                modifier: {
                                    selected: true
                                }
                            },
                        },
                        {
                            extend: 'print',
                            text: 'Print [All]',
                            exportOptions: {
                                columns: ':visible'
                            }
                        },
                        {
                            extend: 'print',
                            text: 'Print [Selected]',
                            exportOptions: {
                                columns: ':visible',
                                modifier: {
                                    selected: true
                                }
                            },
                        }
                    ]
                },

                {
                    text: 'All',
                    action: function () {
                        this.rows().select();
                    }
                },
                {
                    text: 'None',
                    action: function () {
                        this.rows().deselect();
                    }
                }

            ],
            displayLength: 25,
            processing: true,
            language: {
                processing: '<div><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div>'
            },
            serverSide: true,
            lengthMenu: [[25, 50, 100, 200, 500, 1000, 2000], [25, 50, 100, 200, 500, 1000, 2000]],
            infoCallback: function (settings, start, end, max, total, pre) {
                return "<p class='text-primary text-center'>" + pre +
                    "<br>FetchTime: <strong id='iDurationFetchTime' class='text-themecolor'></strong> S<br>" +
                    "LoadTime: <strong id='iDurationLoadTime' class='text-themecolor'></strong> S<br>" +
                    "Total: <strong id='iDurationInfo' class='text-themecolor'></strong> S</p>";
            },
            select: {
                style: 'multi',
                selector: 'td:first-child'
            }, ajax: {
                type: "POST",
                dataType: 'json',
                data: function (dtRequest) {
                    dataTableStartTime = new Date().valueOf();
                    return {request: JSON.stringify(dtRequest)};
                },
                dataSrc: function (json) {
                    return json.data;
                },
                complete: function (response) {
                    console.log(response);
                    let dataTableEndTime = new Date().valueOf();
                    $("#iDurationLoadTime").html(parseFloat(parseFloat(dataTableEndTime - dataTableStartTime) / 1000).toFixed(4));
                    $("#iDurationFetchTime").html(parseFloat(response.responseJSON.duration).toFixed(4));
                    $("#iDurationInfo").html(parseFloat(parseFloat(response.responseJSON.duration) + parseFloat((dataTableEndTime - dataTableStartTime) / 1000)).toFixed(4));
                },
                error: function (err) {
                    console.log(err);
                }
            }
        });
    }


    if ($.fn.validate) {
        $('form[novalidate]').validate({
            ignore: ':hidden:not(.do-not-ignore)',
            submitHandler: function (form) {
                form.submit();
            }
        });
        $.validator.addMethod("checkUserEmailAvailability", function (value, element, excl) {
            let result = false;
            $.ajax({//excl == self | null
                url: '/checkEmail',
                data: {value: value, type: 'User', excl: excl},
                type: "post",
                async: false
            }).done(function (res) {
                result = res;
            }).fail(function (er) {
                console.log(er);
            });
            return result;
        }, "This Email already taken");
        $.validator.addMethod("checkCompanyEmailAvailability", function (value, element, excl) {
            let result = false;
            $.ajax({//excl == self | null
                url: '/checkEmail',
                data: {value: value, type: 'Company', excl: excl},
                type: "post",
                async: false
            }).done(function (res) {
                result = res;
            }).fail(function (er) {
                console.log(er);
            });
            return result;
        }, "This Email already taken");
    }

});

function showPopup(target, url, data) {
    $(".preloader").fadeIn();
    $(target).load(url, data, function (e) {
        //  setTimeout(function (e) {
        $(target).modal("toggle");
        $(".preloader").fadeOut();
        if ($.fn.validate) {
            $('form[novalidate]').validate({
                ignore: ':hidden:not(.do-not-ignore)',
                submitHandler: function (form) {
                    form.submit();
                }
            });
        }
        addAsterisk();
        // }, 1500);
    });
}

function confirmDelete(url, message) {
    if (!message) {
        message = 'Are you sure?<br> Want to delete the Item?';
    }
    eModal.confirm({
        message: message,
        title: 'Confirm Delete',
        size: eModal.size.sm,
        loading: true,
        //subtitle: 'smaller text header',
        label: 'Yes Delete',

    }).then(function (evt) {
        open(url, '_self');
    }, function (evt) {
        console.log('cancel');
    });
}