define([
    'jquery'
], function ($) {

    return function (widget) {
        $.widget('rich.configurable', widget, {
			_fillSelect: function (element) {
	            var attributeId = element.id.replace(/[a-z]*/, ''),
	                options = this._getAttributeOptions(attributeId),
	                prevConfig,
	                index = 1,
	                allowedProducts,
	                i,
	                j,
	                finalPrice = parseFloat(this.options.spConfig.prices.finalPrice.amount),
	                optionFinalPrice,
	                optionPriceDiff,
	                optionPrices = this.options.spConfig.optionPrices,
	                allowedProductMinPrice;

	            this._clearSelect(element);
	            element.options[0] = new Option('', '');
	            element.options[0].innerHTML = this.options.spConfig.chooseText;
	            prevConfig = false;

	            if (element.prevSetting) {
	                prevConfig = element.prevSetting.options[element.prevSetting.selectedIndex];
	            }

	            if (options) {
	                for (i = 0; i < options.length; i++) {
	                    allowedProducts = [];
	                    optionPriceDiff = 0;

	                    /* eslint-disable max-depth */
	                    if (prevConfig) {
	                        for (j = 0; j < options[i].products.length; j++) {
	                            // prevConfig.config can be undefined
	                            if (prevConfig.config &&
	                                prevConfig.config.allowedProducts &&
	                                prevConfig.config.allowedProducts.indexOf(options[i].products[j]) > -1) {
	                                allowedProducts.push(options[i].products[j]);
	                            }
	                        }
	                    } else {
	                        allowedProducts = options[i].products.slice(0);

	                        if (typeof allowedProducts[0] !== 'undefined' &&
	                            typeof optionPrices[allowedProducts[0]] !== 'undefined') {
	                            allowedProductMinPrice = this._getAllowedProductWithMinPrice(allowedProducts);
	                            optionFinalPrice = parseFloat(optionPrices[allowedProductMinPrice].finalPrice.amount);
	                            optionPriceDiff = optionFinalPrice - finalPrice;

	                            if (optionPriceDiff !== 0) {
	                                options[i].label = options[i].label + ' ' + priceUtils.formatPrice(
	                                    optionPriceDiff,
	                                    this.options.priceFormat,
	                                    true);
	                            }
	                        }
	                    }

	                    if (allowedProducts.length > 0) {
	                        options[i].allowedProducts = allowedProducts;
	                        element.options[index] = new Option(this._getOptionLabel(options[i]), options[i].id);
							
							element.options[index].innerHTML += ' (' + options[i].qty + ' in stock)';

	                        if (typeof options[i].price !== 'undefined') {
	                            element.options[index].setAttribute('price', options[i].price);
	                        }

	                        element.options[index].config = options[i];
	                        index++;
	                    } else {
	                    	element.options[index] = new Option(this._getOptionLabel(options[i]), options[i].id);
	                    	element.options[index].innerHTML += ' ' + '(Out of stock)';
	                    	element.options[index].config = options[i];
	                    	index++;
	                    }

	                    /* eslint-enable max-depth */
	                }
	            }
	        },

	        _configureElement: function (element) {
	            this.simpleProduct = this._getSimpleProductId(element);

	            if (element.value) {
	                this.options.state[element.config.id] = element.value;

	                if (element.nextSetting) {
	                    element.nextSetting.disabled = false;
	                    this._fillSelect(element.nextSetting);
	                    this._resetChildren(element.nextSetting);
	                } else {
	                    if (!!document.documentMode) { //eslint-disable-line
	                        this.inputSimpleProduct.val(element.options[element.selectedIndex].config.allowedProducts[0]);
	                    } else {
	                    	if(typeof element.selectedOptions[0].config.allowedProducts !== 'undefined') {
	                    		$('#product-addtocart-button').removeClass('disabled');
	                        	this.inputSimpleProduct.val(element.selectedOptions[0].config.allowedProducts[0]);
	                    	} else {
	                    		$('#product-addtocart-button').addClass('disabled');
	                    		return;
	                    	}
	                    }
	                }
	            } else {
	                this._resetChildren(element);
	            }

	            this._reloadPrice();
	            this._displayRegularPriceBlock(this.simpleProduct);
	            this._displayTierPriceBlock(this.simpleProduct);
	            this._displayNormalPriceLabel();
	            this._changeProductImage();
	        },

        });
        return $.rich.configurable;
    };
});