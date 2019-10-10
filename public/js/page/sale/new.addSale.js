class Tax {
	constructor() {
		this.name = "";
		this.rate = 0;
		this.percent = true;//percent=true
		this.amount = 0;
		this.id = '';
	}
}

class Discount {
	constructor() {
		this.rate = 0;
		this.type = true;//percent=true
		this.amount = 0;
	}
}

class PickedItem {
	constructor() {
		this.item = {};
		this.quantity = 0;
		this.price = 0;
		this.discount = new Discount();
		this.itemID = '';
		this.comment = '';
		this.tax = new Tax();
		this.subTotal = 0;
		this.total = 0;
	}

	getSubTotal() {
		this.subTotal = this.quantity * this.price - this.discount.amount;
		return this.subTotal;
	}

	getTotal() {
		this.total = this.subTotal + this.tax.amount;
		return this.total;
	}

	getTax() {
		this.tax.amount = (this.tax.percent ? (this.tax.rate / 100 * (this.price - (this.discount.amount / this.quantity)) * this.quantity) : this.tax.rate * this.quantity);
		return this.tax.amount;
	}

	getDiscount() {
		this.discount.amount = (this.discount.type ? (this.discount.rate / 100 * this.price) : this.discount.rate) * this.quantity;
		return this.discount.amount;
	}

}

class PickedItemList {
	constructor() {
		this.date = null;
		this.customer = null;
		this.itemList = {};
		this.subTotal = 0;
		this.orderDiscount = new Discount();
		this.productDiscount = 0;
		this.orderTax = new Tax();
		this.productTax = 0;
		this.total = 0;
		this.grandTotal = 0;
		this.item = 0;
		this.itemType = 0;
		this.excludes = [];
		this.saleNote = '';
		this.staffNote = '';
	}

	getItem(id) {
		return this.itemList[id];
	}

	addItem(item) {
		this.itemList[item.itemID] = item;
	}

	getTotal() {
		let values = {
			item: 0, itemType: 0, discount: 0, sub: 0, tax: 0, total: 0
		};
		for (let key in this.itemList) {
			let item = this.itemList[key];
			values.item += item.quantity;
			values.discount += item.discount.amount;
			values.tax += item.tax.amount;
			values.sub += item.subTotal;
			values.total += item.subTotal + item.tax.amount;
			values.itemType++;
		}
		this.productTax = values.tax;
		this.productDiscount = values.discount;
		this.itemType = values.itemType;
		this.item = values.item;
		this.total = values.total;
		this.subTotal = this.total - this.orderDiscount.amount;
		this.grandTotal = this.subTotal + this.orderTax.amount;
		return values;
	}
}

/**/
var pil = new PickedItemList();
let dateTime = $("#dateTime").daterangepicker({
	singleDatePicker: true,
	timePicker: true,
	showDropdowns: true,
	autoApply: true,
	locale: {
		format: globalSetting.settings.dateFormat + ' ' + globalSetting.settings.timeFormat
	},
	startDate: pil.date ? globalSetting.dbDateTimeFormatter(pil.date) : new Date()
});
dateTime.on('change', function () {
	pil.date = $("#dateTime").val();
	saveToLocal();
});

var $customerSelectize = $("#customer").selectize({
	plugins: ["clear_button"],
	dropdownParent: "body",
	placeholder: "Select Customer",
	preload: false,
	valueField: 'id',
	labelField: 'name',
	searchField: 'name',
	load: function (query, callback) {
		$.ajax({
			dataType: "json",
			type: 'post',
			url: globalSetting.baseUrl + "/peoples/getCustomer",
			data: {term: query},
			error: function () {
				callback();
			},
			success: function (res) {
				callback(res);
			}
		});
	},
	onItemAdd: function (value, item) {
		let customer = $customerSelectize[0].selectize.options[value];
		delete customer.$order;
		pil.customer = customer;
		pil.date = $("#dateTime").val();
		saveToLocal();
	},
	onClear: function () {
		pil.customer = null;
		pil.date = null;
		saveToLocal();
	}
});
var $productSltz = $("#product").selectize({
	plugins: ["clear_button"],
	dropdownParent: "body",
	placeholder: "Type Product Name or Code Here ...",
	preload: false,
	valueField: '_id',
	labelField: 'name',
	searchField: ['name', 'code'],
	selectOnTab: true,
	load: function (query, callback) {
		$.ajax({
			dataType: "json",
			type: 'post',
			url: globalSetting.baseUrl + "/product/getProduct",
			data: {term: query, excludes: pil.excludes}
		}).fail(function (err) {
			console.log(err);
			callback(err);
		}).done(function (res) {
			callback(res);
		});
	},
	onLoad: function (data) {
		if (data.length === 1) {
			this.setValue(data[0]._id);
		}
	},
	onItemAdd: function (itemID) {
		let item = $productSltz[0].selectize.options[itemID];
		let tx = new Tax();
		let pi = new PickedItem();
		delete item['$order'];
		pi.item = item;
		pi.itemID = itemID;
		pi.price = item.price;
		pi.quantity = 1;
		tx.id = item.taxRate._id;
		tx.amount = (item.taxRate.percent ? (item.taxRate.rate / 100 * item.price) : item.taxRate.rate) * pi.quantity;
		tx.rate = item.taxRate.rate;
		tx.percent = item.taxRate.percent;
		tx.name = item.taxRate.name;
		pi.tax = tx;
		pil.addItem(pi);
		orderTable.bootstrapTable('append', pi);
		pil.excludes.push(pi.itemID);
		$productSltz[0].selectize.clearOptions();
		updateTotal();
	}
});

var orderTable = $("#orderTable").bootstrapTable({
	locale: globalSetting.settings.language,
	showColumns: false,
	uniqueId: "itemID",
	onPostBody: function (data) {
		$(".quantity").TouchSpin({
			buttondown_class: 'btn btn-warning',
			buttonup_class: 'btn btn-danger',
			min: 1,
		}).css({
			"text-align": "center",
			"max-width": "50px",
			"min-width": "30px",
			"color": "tomato",
			"font-weight": 600
		}).on('change', function () {
			let id = $(this).data('productid');
			let product = pil.getItem(id);
			product.quantity = Number($(this).val());
			updateProduct(product);
		});
	},
	columns: [
		[{
			title: 'Product Name',
			align: 'left',
			valign: 'middle',
			formatter: function (data, row) {
				return '<button type="button" class="btn btn-link" onclick="showProductDetails(`' + row.itemID + '`)">' + row.item.name + '</button>';
			},
			footerFormatter: "Total"
		}, {
			title: 'Unit Price',
			align: 'center',
			valign: 'middle',
			formatter: function (data, row) {
				return globalSetting.currencyFormat(row.price);
			}
		}, {
			title: 'Quantity',
			align: 'center',
			class: "text-center",
			valign: 'middle',
			formatter: function (data, row) {
				return '<input type="text" class="form-control quantity" ' +
					' size="1" data-productID="' + row.itemID + '"' +
					' value="' + row.quantity + '" data-bts-button-down-class="btn btn-secondary btn-outline"' +
					' data-bts-button-up-class="btn btn-secondary btn-outline">';
			}
		}, {
			title: 'Discount',
			align: 'right',
			valign: 'middle',
			formatter: function (data, row) {
				return globalSetting.currencyFormat(row.getDiscount()) + " " + (row.discount.type ? " [@" + row.discount.rate + "%]" : "");
			}
		}, {
			title: 'SubTotal',
			field: 'subTotal',
			align: 'right',
			valign: 'middle',
			formatter: function (data, row) {
				return globalSetting.currencyFormat(row.getSubTotal());
			}
		}, {
			title: 'Product Tax',
			align: 'right',
			valign: 'middle',
			formatter: function (data, row) {
				return globalSetting.currencyFormat(row.getTax()) + " " + (row.tax.percent ? " [@" + row.tax.rate + "%]" : "");
			}
		}, {
			title: 'Total',
			field: 'total',
			align: 'right',
			valign: 'middle',
			formatter: function (data, row) {
				return globalSetting.currencyFormat(row.getTotal());
			}
		}, {
			title: '',
			field: 'itemID',
			align: 'center',
			valign: 'middle',
			formatter: function (id) {
				return '<button onclick="removeRowByID(`' + id + '`)" ' +
					'class="btn btn-danger" type="button">' +
					'<i class="fa fa-trash"></i>' +
					'</button>';
			}
		}]
	],
});

if (localStorage.getItem('addSale')) {
	let data = JSON.parse(localStorage.getItem('addSale'));
	for (let key in data) {
		pil[key] = data[key];
		if (key === 'itemList') {
			let itemList = data[key];
			for (let it in itemList) {
				let itm = itemList[it];
				let item = new PickedItem();
				for (let d in itm) {
					item[d] = itm[d];
				}
				pil.addItem(item);
				orderTable.bootstrapTable('append', item);
			}
		}
	}
	$("#saleNote").val(pil.saleNote);
	$("#staffNote").val(pil.staffNote);
	$("#orderDiscount").val(pil.orderDiscount.rate);
	if (pil.orderDiscount.type) {
		$("#orderDiscountType").prop('checked', true);
	}
	if (pil.orderTax.id) {
		$("#orderTax").val(pil.orderTax.id);
	}
	if (pil.customer) {
		$customerSelectize[0].selectize.addOption(pil.customer);
		$customerSelectize[0].selectize.setValue(pil.customer.id, true);
	}
	updateTotal();
}

$("#orderTax").on("change", function () {
	updateTotal();
});

$("#orderDiscount").on("keyup", function () {
	updateTotal();
});

function updateProduct(product) {
	orderTable.bootstrapTable('updateByUniqueId', {id: product.itemID, row: product, replace: false});
	updateTotal();
}

function updateTotal() {
	let productTotal = pil.getTotal();
	let value = $("#orderDiscount").val();
	let discount = new Discount();
	discount.rate = value;
	if (!$("#orderDiscountType").is(":checked")) {
		discount.type = false;
		discount.amount = Number($("#orderDiscount").val());
	} else {
		discount.type = true;
		discount.amount = Number($("#orderDiscount").val()) * Number(pil.total) / 100;
	}
	pil.orderDiscount = discount;
	let tax = globalSetting.tax[$('#orderTax').val()];
	let tx = new Tax();
	tx.id = $('#orderTax').val();
	tx.name = tax.name;
	tx.rate = tax.rate;
	tx.percent = tax.percent;
	tx.amount = (tx.percent ? (tx.rate / 100 * pil.subTotal) : tx.rate);
	pil.orderTax = tx;
	productTotal = pil.getTotal();
	$("#subTotalText").html(globalSetting.currencyFormat(productTotal.sub));
	$("#totalText").html(globalSetting.currencyFormat(productTotal.total));
	$("#discountText").html(globalSetting.currencyFormat(productTotal.discount));
	$("#productTaxText").html(globalSetting.currencyFormat(productTotal.tax));
	$("#quantityText").html(productTotal.itemType + " [" + parseInt(productTotal.item) + "]");
	//
	$("#totalItem").text(pil.itemType + " [" + parseInt(pil.item) + "]");
	$("#productTotal").text(globalSetting.currencyFormat(pil.total));
	$("#orderDiscountTotal").html(globalSetting.currencyFormat(pil.orderDiscount.amount));
	$("#orderSubTotal").html(globalSetting.currencyFormat(pil.subTotal));
	$("#orderTaxTotal").html(globalSetting.currencyFormat(pil.orderTax.amount));
	$("#grandTotal").html(globalSetting.currencyFormat(pil.grandTotal));
	saveToLocal();
}

function changeOrderDiscountType() {
	let value = $("#orderDiscount").val();
	let discount = new Discount();
	discount.rate = value;
	if (!$("#orderDiscountType").is(":checked")) {
		discount.type = false;
		discount.amount = Number($('#orderDiscount').val());
	} else {
		discount.type = true;
		discount.amount = Number($('#orderDiscount').val()) * Number(pil.total) / 100;
	}
	pil.orderDiscount = discount;
	updateTotal();
}

function removeRowByID($id) {
	orderTable.bootstrapTable('removeByUniqueId', $id);
	pil.excludes.pop($id);
	delete pil.itemList[$id];
	updateTotal();
}

function removeAll() {
	orderTable.bootstrapTable('removeAll');
	pil.excludes = [];
	pil.itemList = {};
	updateTotal();
}

$("#saleNote").on('change', function () {
	pil.saleNote = $(this).val();
	saveToLocal();
});
$("#staffNote").on('change', function () {
	pil.staffNote = $(this).val();
	saveToLocal();
});

function saveToLocal() {
	localStorage.setItem("addSale", JSON.stringify(pil));
}

function showProductDetails(id) {
	let product = pil.getItem(id);
	let taxRates = {};
	$.map(globalSetting.tax, function (value, id) {
		taxRates[id] = value.name;
		return {id};
	});
	$.MessageBox({
		top: "20%",
		customOverlayClass: "modal",
		buttonsOrder: "fail done",
		buttonDone: "Done",
		buttonFail: "Close",
		title: product.name + " - Preview",
		customClass: "form-material modal-sm",
		input: {
			quantity: {
				type: "text",
				label: "Product Quantity",
				title: "Price",
				id: "io",
				customClass: "integer form-control",
				defaultValue: product.quantity
			},
			price: {
				type: "text",
				label: "Product Price",
				title: "Price",
				customClass: "decimal form-control",
				defaultValue: product.price
			},
			discountRate: {
				type: "text",
				label: "Product Discount",
				title: "Discount",
				customClass: "decimal form-control text-center discount",
				defaultValue: product.discount.rate
			},
			note: {
				type: "textarea",
				label: "Product Note",
				title: "Note",
				customClass: " form-control",
				defaultValue: product.comment,
				rows: 4
			},
			taxRateID: {
				type: "select",
				label: "Product tax",
				title: "Select a Tax",
				customClass: "form-control",
				options: taxRates,
				defaultValue: product.tax.id
			}
		}
	}).done(function (form) {
		product.price = Number(form.price);
		product.quantity = Number(form.quantity);
		product.comment = form.note;

		product.discount.rate = Number(form.discountRate);
		product.discount.type = form.discountType;
		if (!form.discountType) {
			product.discount.type = false;
			//product.discount.amount = Number(form.discountRate);
		} else {
			product.discount.type = true;
			//product.discount.amount = (Number(form.discountRate) * Number(form.price) / 100) * product.quantity;
		}

		let taxRate = globalSetting.tax[form.taxRateID];
		product.tax.id = form.taxRateID;
		//product.tax.amount = (taxRate.percent ? (taxRate.rate / 100 * ((product.price * product.quantity) - product.discount.amount)) : taxRate.rate * product.quantity);
		product.tax.rate = taxRate.rate;
		product.tax.percent = taxRate.percent;
		product.tax.name = taxRate.name;
		updateProduct(product);
	});
	$(".discount").wrap('<div class="input-group" id="discountInputGroup"></div>');
	$("#discountInputGroup").prepend('<div class="input-group-addon">' +
		'<input type="checkbox" data-toggle="bsSwitch" class="form-check-input" value="true"' +
		' name="discountType" data-on-text="%" data-off-text="$">' +
		'</div>');
	$('[data-toggle="bsSwitch"]').bootstrapSwitch({
		labelText: 'Discount Type',
		onColor: "default",
		offColor: "default",
		size: "large",
		baseClass: "input-group-append bootstrap-switch"
	}).bootstrapSwitch('state', product.discount.type);
}

$("#submitForm").on('click', function () {
	console.log(pil);
	if (pil.customer && Object.keys(pil.itemList).length > 0) {
		$.post($("#saleForm").attr("action"), pil, null, "json")
			.done(function (body, status, req) {
				if (body.status) {
					toastr.success("Sale added!<br>Now redirecting to print receipt!", "Sale Added Successfully!");
					localStorage.removeItem("addSale");
					setTimeout(function () {
						open(globalSetting.baseUrl + "/sale/printSale/" + body.saleID, "_self");
					}, 1000);
				} else {
					toastr.error("Something went wrong!<br>Please Try Again!", "Sale Not Saved!");
				}
			})
			.fail(function (e, t, y) {
				console.log(e, t, y);
				toastr.error("Something went wrong!<br>Please Try Again!", "Sale Not Saved!");
			});
	} else {
		toastr.error("No product or customer selected!", "Failed!");
	}
});

function viewCustomer() {
	let $customer = $("#customer");
	if ($customer.val()) {
		showPopup("#remoteModal1", globalSetting.baseUrl + '/peoples/customer/' + $customer.val());
	} else {
		toastr.warning("No customer Selected!", "Not Found!");
	}
}