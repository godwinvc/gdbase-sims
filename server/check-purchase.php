<?php
include './connection.php';
include './import_wordpress.php';
function has_bought_items($user_id = 0, $product_ids = 0)
{
    global $wpdb;
    $customer_id = $user_id == 0 || $user_id == '' ? get_current_user_id() : $user_id;
    $statuses = array_map('esc_sql', wc_get_is_paid_statuses());

    if (is_array($product_ids)) {
        $product_ids = implode(',', $product_ids);
    }

    if ($product_ids != (0 || '')) {
        $query_line = "AND woim.meta_value IN ($product_ids)";
    } else {
        $query_line = "AND woim.meta_value != 0";
    }

    // Count the number of products
    $product_count_query = $wpdb->get_col("
        SELECT COUNT(woim.meta_value) FROM {$wpdb->prefix}posts AS p
        INNER JOIN {$wpdb->prefix}postmeta AS pm ON p.ID = pm.post_id
        INNER JOIN {$wpdb->prefix}woocommerce_order_items AS woi ON p.ID = woi.order_id
        INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS woim ON woi.order_item_id = woim.order_item_id
        WHERE p.post_status IN ( 'wc-" . implode("','wc-", $statuses) . "' )
        AND pm.meta_key = '_customer_user'
        AND pm.meta_value = $customer_id
        AND woim.meta_key IN ( '_product_id', '_variation_id' )
        $query_line
    ");
    // Set the count in a string
    $count = reset($product_count_query);

    // Return a boolean value if count is higher than 0
    return $count > 0 ? true : false;
}
// Simulation Ids: 
/*
simulation 2: 694,
simulation 3: 695,
simulation 4: 696,
simulation 5: 700,
simulation 6: 701,
simulation 7: 701,
simulation 8: 701,
*/
$product_ids = array(694, 695, 696, 700, 701, 701, 701);

/*if( has_bought_items( '', $product_ids ) )
    echo "<p>You have already purchased one of this products</p>";
else
    echo "<p>You have not yet purchased one of this products</p>";*/
$simulations = array(
    "simulation2" => false,
    "simulation3" => false,
    "simulation4" => false,
    "simulation5" => false,
    "simulation6" => false,
    "simulation7" => false,
    "simulation8" => false,
);
for( $i = 0; $i < count($product_ids); $i++){
     $simulations['simulation'. ($i + 2)] = has_bought_items( '', array($product_ids[$i]) );
}

echo json_encode($simulations);