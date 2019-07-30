<?php
    namespace Rich\ProductQuantities\Model;

    class ConfigurableAttributeData extends \Magento\ConfigurableProduct\Model\ConfigurableAttributeData
    {
        protected $stockState;

        public function __construct(
            \Magento\CatalogInventory\Api\StockStateInterface $stockState
        ){
            $this->_stockState = $stockState;
        }
        protected function getAttributeOptionsData($attribute, $config) {

            $attributeOptionsData = [];
            foreach ($attribute->getOptions() as $attributeOption) {

                $optionId = $attributeOption['value_index'];

                $attributeOptionsData[] = [
                    'id' => $optionId,
                    'label' => $attributeOption['label'],
                    'products' => isset($config[$attribute->getAttributeId()][$optionId])
                        ? $config[$attribute->getAttributeId()][$optionId]
                        : [],
                    'qty' => isset($config[$attribute->getAttributeId()][$optionId][0])
                        ? $this->_stockState->getStockQty($config[$attribute->getAttributeId()][$optionId][0])
                        : '',
                ];
            }
            return $attributeOptionsData;
        }
    }