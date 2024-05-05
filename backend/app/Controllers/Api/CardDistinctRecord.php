<?php namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;

class CardDistinctRecord extends ResourceController
{
    protected $format = 'json';

    protected $dateduplicatechecker = [];

    /*
    -------sakila----------------------------------------------------
    |    Payment – customer – store – inventory  – film – language  |
    |                |        / |   \                               |
    |             address    /address\                              |
    |                |   ITEMS  |     \                             |
    |              city        city    \                            |
    |                |          |       \                           |
    |             country     country    \                          |
    |                                     \                         |
    ---------------------------------------\------- -----------------
                                            \
                                             \
                                              \
    --------mysql_json_db--------------------- \---------------------
    |                                           \                   |
    |                                            \                  |
    |                                             \                 |
    |                                              \                |
    |                                            ITEMS              |
    |                                                               |
    |                                                               |
    |                                                               |
    -----------------------------------------------------------------



    -------sakila---------------------------------------------------
    |    Payment – customer – store – inventory  – film – language |
    |     \          |         |   \                               |
    |      \      address    address\                              |
    |       \        |         |     \                             |
    |        \     city      city     \                            |
    |         \      |         |       \                           |
    |          \  country   country     \                          |
    |           \                        \                         |
    -------------\------------------------\-------------------------
                  \                        \
                   \                        \
                    \                        \
    --mysql_json_db--\------------------------\---------------------
    |                 \                        \                   |
    |                  \                        \                  |
    |                   \                        \                 |
    |                    \                        \                |
    |                     \                      ITEMS             |
    |                    order – sales                             |
    |                                                              |
    |                                                              |
    ----------------------------------------------------------------
    

    protected $clusters = [
        [['payment', 'customer'], ['customer_id', 'customer_id']],
        [['customer', 'store'], ['store_id', 'store_id']],
        [['store', 'inventory'],['store_id', 'store_id']],
        [['store', 'ITEMS_mysql_json_db'], ['store_id', 'store_id']],
        [['store', 'ITEMS_sakila'], ['store_id', 'store_id']],
        [['inventory', 'film'], ['film_id', 'film_id']],
        [['film', 'language'], ['language_id', 'language_id']],
        [['customer', 'address'], ['address_id', 'address_id']],
        [['store', 'address'], ['address_id', 'address_id']],
        [['address', 'city'], ['city_id', 'city_id']],
        [['city', 'country'], ['country_id', 'country_id']]
    ];
    */

    protected $clusters = [
        [['payment', 'rental'], ['rental_id', 'rental_id']],
        [['rental', 'inventory'], ['inventory_id', 'inventory_id']],
        [['inventory', 'film'], ['film_id', 'film_id']],
        [['film', 'language'], ['language_id', 'language_id']],
        [['film', 'film_actor'], ['film_id', 'film_id']],
        [['film_actor', 'actor'], ['actor_id', 'actor_id']],
        [['film', 'film_category'], ['film_id', 'film_id']],
        [['film_category', 'category'], ['category_id', 'category_id']],
        [['rental', 'customer'], ['customer_id', 'customer_id']],
        [['customer', 'store'], ['store_id', 'store_id']],
        [['store', 'staff'], ['manager_staff_id', 'staff_id']],
        [['customer', 'address'], ['address_id', 'address_id']],
        [['store', 'address'], ['address_id', 'address_id']],
        [['staff', 'address'], ['address_id', 'address_id']],
        [['address', 'city'], ['city_id', 'city_id']],
        [['city', 'country'], ['country_id', 'country_id']]
    ];

    protected $multipledbconnectionwithtableandalias = [
        'mysql_json_db' => [
            'tableandalias' => [
                [
                    'table' =>'ITEMS',
                    'alias' => 'ITEMS_mysql_json_db'
                ]
            ],
            'connection' => [
                'DSN'      => '',
                'hostname' => 'dbtwo',
                'username' => 'user',
                'password' => 'test',
                'database' => 'mysql_json_db',
                'DBDriver' => 'MySQLi',
                'DBPrefix' => '',
                'pConnect' => false,
                'DBDebug'  => (ENVIRONMENT !== 'production'),
                'charset'  => 'utf8mb4',
                'DBCollat' => 'utf8mb4_general_ci',
                'swapPre'  => '',
                'encrypt'  => false,
                'compress' => false,
                'strictOn' => false,
                'failover' => [],
                'port'     => 3306,
            ]
        ],
        'sakila' => [
            'tableandalias' => [
                [
                    'table' =>'ITEMS',
                    'alias' => 'ITEMS_sakila'
                ],
                [
                    'table' => 'store'
                ],
                [
                    'table' => 'inventory'
                ],
                [
                    'table' =>'payment'
                ],
                [
                    'table' =>'customer'
                ],
                [
                    'table' =>'film'
                ],
                [
                    'table' =>'language'
                ],
                [
                    'table' =>'address'
                ],
                [
                    'table' =>'city'
                ],
                [
                    'table' =>'country'
                ]
            ],
            'connection' => [
                'DSN'      => '',
                'hostname' => 'dbone',
                'username' => 'user',
                'password' => 'test',
                'database' => 'sakila',
                'DBDriver' => 'MySQLi',
                'DBPrefix' => '',
                'pConnect' => false,
                'DBDebug'  => (ENVIRONMENT !== 'production'),
                'charset'  => 'utf8mb4',
                'DBCollat' => 'utf8mb4_general_ci',
                'swapPre'  => '',
                'encrypt'  => false,
                'compress' => false,
                'strictOn' => false,
                'failover' => [],
                'port'     => 3306,
            ]
        ]
    ];

    protected $cards = [];

    private function loopThroughDBConnections($table) {
        $actualdb = '';
        $found = false;
        $actualtable = $table;
        foreach($this->multipledbconnectionwithtableandalias as $dbkey => $dbvalue) {
            foreach($dbvalue['tableandalias'] as $tableandalias) {
                if(array_key_exists('alias', $tableandalias)) {
                    if(
                        $table === $tableandalias['alias']
                    ) {
                        $actualdb = $dbkey;
                        $actualtable = $tableandalias['table'];
                        $found = true;
                        break;
                    }
                }
                else {
                    if($table === $tableandalias['table']) {
                        $actualdb = $dbkey;
                        $actualtable = $tableandalias['table'];
                        $found = true;
                        break;
                    }
                }
            }
            if($found) {
                break;
            }
        }
        return ['db' => $actualdb, 'table' => $actualtable];
    }

    private function reconstructClusters($dbkey, $clusters) {
        for($i=0; $i<count($clusters); $i++) {
            foreach($this->multipledbconnectionwithtableandalias[$dbkey]['tableandalias'] as $tableandalias) {
                if(array_key_exists('alias', $tableandalias)) {
                    if($clusters[$i][0][0] === $tableandalias['alias'] || $clusters[$i][0][1] === $tableandalias['alias']) {
                        if($clusters[$i][0][0] === $tableandalias['alias']) {
                            $clusters[$i][0][0] = $tableandalias['table'];
                        }
                        else {
                            $clusters[$i][0][1] = $tableandalias['table'];
                        }
                    }
                }
            }
        }
        return $clusters;
    }

    private function findClustersWithinTheSameDBAndInterDBRelatedClusters($config) {
        $clusters = [
            'CLUSTERS-WITHIN-THE-SAME-DB' => [],
            'INTER-DB-RELATED-CLUSTERS' => []
        ];
        foreach($config as $key => $value) {
            foreach($value as $multipletype) {
                if($this->isConcatenated($multipletype)) {
                    $alldbs = [];
                    foreach($multipletype['concatenated']['fields'] as $fieldindex => $fieldvalue) {
                        $tableresult = $this->loopThroughDBConnections($fieldvalue['table']);
                        if($this->isJoined($fieldvalue)) {
                            //concatenation via join
                            $joinresult = $this->loopThroughDBConnections($fieldvalue['join']);
                            if($tableresult['db'] === $joinresult['db']) {
                                if(!in_array($tableresult['db'], $alldbs)) {
                                    array_push(
                                        $alldbs,
                                        $tableresult['db']
                                    );
                                }
                            }
                            else {
                                if(!in_array($tableresult['db'], $alldbs)) {
                                    array_push(
                                        $alldbs,
                                        $tableresult['db']
                                    );
                                }
                                if(!in_array($joinresult['db'], $alldbs)) {
                                    array_push(
                                        $alldbs,
                                        $joinresult['db']
                                    );
                                }
                            }
                        }
                        else {
                            //concatenation without join
                            if(!in_array($tableresult['db'], $alldbs)) {
                                array_push(
                                    $alldbs,
                                    $tableresult['db']
                                );
                            }
                        }
                    }
                    if(count($alldbs) === 1) {
                        foreach($multipletype['concatenated']['fields'] as $fieldindex => $fieldvalue) {
                            $tableresult = $this->loopThroughDBConnections($fieldvalue['table']);
                            if($this->isJoined($fieldvalue)) {
                                //concatenation via join
                                $joinresult = $this->loopThroughDBConnections($fieldvalue['join']);
                                $multipletype['concatenated']['fields'][$fieldindex]['join'] = $joinresult['table'];
                                $multipletype['concatenated']['fields'][$fieldindex]['table'] = $tableresult['table'];
                            }
                            else {
                                //concatenation without join
                                $multipletype['concatenated']['fields'][$fieldindex]['table'] = $tableresult['table'];
                            }
                        }
                        
                        if(array_key_exists($alldbs[0], $clusters['CLUSTERS-WITHIN-THE-SAME-DB'])) {
                            if(array_key_exists($key, $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$alldbs[0]])) {
                                array_push(
                                    $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$alldbs[0]][$key],
                                    $multipletype
                                );
                            }
                            else {
                                $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$alldbs[0]][$key] = [];
                                array_push(
                                    $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$alldbs[0]][$key],
                                    $multipletype
                                );
                            }
                        }
                        else {
                            $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$alldbs[0]][$key] = [];
                            array_push(
                                $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$alldbs[0]][$key],
                                $multipletype
                            );
                        }
                    }
                    else {
                        if(array_key_exists($key, $clusters['INTER-DB-RELATED-CLUSTERS'])) {
                            array_push(
                                $clusters['INTER-DB-RELATED-CLUSTERS'][$key],
                                $multipletype
                            );
                        }
                        else {
                            $clusters['INTER-DB-RELATED-CLUSTERS'][$key] = [];
                            array_push(
                                $clusters['INTER-DB-RELATED-CLUSTERS'][$key],
                                $multipletype
                            );
                        }
                    }
                }
                else {
                    $tableresult = $this->loopThroughDBConnections($multipletype['table']);
                    if($this->isJoined($multipletype)) {
                        //join without concatenation
                        $joinresult = $this->loopThroughDBConnections($multipletype['join']);

                        if($tableresult['db'] === $joinresult['db']) {
                            $multipletype['join'] = $joinresult['table'];
                            $multipletype['table'] = $tableresult['table'];
                            
                            if(array_key_exists($tableresult['db'], $clusters['CLUSTERS-WITHIN-THE-SAME-DB'])) {
                                if(array_key_exists($key, $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$tableresult['db']])) {
                                    array_push(
                                        $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$tableresult['db']][$key],
                                        $multipletype
                                    );
                                }
                                else {
                                    $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$tableresult['db']][$key] = [];
                                    array_push(
                                        $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$tableresult['db']][$key],
                                        $multipletype
                                    );
                                }
                            }
                            else {
                                $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$tableresult['db']][$key] = [];
                                array_push(
                                    $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$tableresult['db']][$key],
                                    $multipletype
                                );
                            }
                        }
                        else {
                            if(array_key_exists($key, $clusters['INTER-DB-RELATED-CLUSTERS'])) {
                                array_push(
                                    $clusters['INTER-DB-RELATED-CLUSTERS'][$key],
                                    $multipletype
                                );
                            }
                            else {
                                $clusters['INTER-DB-RELATED-CLUSTERS'][$key] = [];
                                array_push(
                                    $clusters['INTER-DB-RELATED-CLUSTERS'][$key],
                                    $multipletype
                                );
                            }
                        }
                    }
                    else {
                        $multipletype['table'] = $tableresult['table'];
                        //no join no concatenation = single
                        if(array_key_exists($tableresult['db'], $clusters['CLUSTERS-WITHIN-THE-SAME-DB'])) {
                            if(array_key_exists($key, $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$tableresult['db']])) {
                                array_push(
                                    $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$tableresult['db']][$key],
                                    $multipletype
                                );
                            }
                            else {
                                $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$tableresult['db']][$key] = [];
                                array_push(
                                    $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$tableresult['db']][$key],
                                    $multipletype
                                );
                            }
                        }
                        else {
                            $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$tableresult['db']][$key] = [];
                            array_push(
                                $clusters['CLUSTERS-WITHIN-THE-SAME-DB'][$tableresult['db']][$key],
                                $multipletype
                            );
                        }
                    }
                }
            }
        }
        return $clusters;
    }

    private function mysqlTimeFormatMap() {
        return [
            "24-HCWOSWLZ" => "%H:%i",
            "24-HCWOSWOLZ" => "%k:%i",
            "12-HCWOSWLZ" => "%h:%i %p",
            "12-HCWOSWOLZ" => "%l:%i %p",
            "24-HCWS" => "%T",
            "12-HCWS" => "%r"
        ];
    }

    private function mysqlDateFormatMap() {
        return [
            //Big Endian Date Format (year, month, day)
            "yy/mm/dd" => "%y/%m/%d",
            "yy/mm/d" => "%y/%m/%e",
            "yy/m/dd" => "%y/%c/%d",
            "yy/m/d" => "%y/%c/%e",
            "yyyy/mm/dd" => "%Y/%m/%d",
            "yyyy/mm/d" => "%Y/%m/%e",
            "yyyy/m/dd" => "%Y/%c/%d",
            "yyyy/m/d" => "%Y/%c%e",
            "yyyy mmmm dd" => "%Y %M %d",
            "yyyy mmmm d" => "%Y %M %e",
            "yyyy mmm dd" => "%Y %b %d",
            "yyyy mmm d" => "%Y %b %e",
            "ddd, yyyy mmmm dd" => "%a, %Y %M %d",
            "ddd, yyyy mmmm d" => "%a, %Y %M %e",
            "ddd, yyyy mmm dd" => "%a, %Y %b %d",
            "ddd, yyyy mmm d" => "%a, %Y %b %e",
            "dddd, yyyy mmmm dd" => "%W, %Y %M %d",
            "dddd, yyyy mmmm d" => "%W, %Y %M %e",
            "dddd, yyyy mmm dd" => "%W, %Y %b %d",
            "dddd, yyyy mmm d" => "%W, %Y %b %e",
            "dddd yyyy mmmm dd" => "%W %Y %M %d",
            "dddd yyyy mmmm d" => "%W %Y %M %e",
            "dddd yyyy mmm dd" => "%W %Y %b %d",
            "dddd yyyy mmm d" => "%W %Y %b %e",
            "yy.mm.dd" => "%y.%m.%d",
            "yy.mm.d" => "%y.%m.%e",
            "yy.m.dd" => "%y.%c.%d",
            "yy.m.d" => "%y.%c.%e",
            "yyyy.mm.dd" => "%Y.%m.%d",
            "yyyy.mm.d" => "%Y.%m.%e",
            "yyyy.m.dd" => "%Y.%c.%d",
            "yyyy.m.d" => "%Y.%c.%e",
            "yy. mm. dd" => "%y. %m. %d",
            "yy. mm. d" => "%y. %m. %e",
            "yy. m. dd" => "%y. %c %d",
            "yy. m. d" => "%y. %c. %e",
            "yyyy. mm. dd" => "%Y. %m. %d",
            "yyyy. mm. d" => "%Y. %m. %e",
            "yyyy. m. dd" => "%Y. %c. %d",
            "yyyy. m. d" => "%Y. %c. %e",
            "yy-mm-dd" => "%y-%m-%d",
            "yy-mm-d" => "%y-%m-%e",
            "yy-m-dd" => "%y-%c-%d",
            "yy-m-d" => "%y-%c-%e",
            "yyyy-mm-dd" => "%Y-%m-%d",
            "yyyy-mm-d" => "%Y-%m-%e",
            "yyyy-m-dd" => "%Y-%c-%d",
            "yyyy-m-d" => "%Y-%c-%e",
            //little-endian (day, month, year)
            "dd/mm/yyyy" => "%d/%m/%Y",
            "dd/m/yyyy" => "%d/%c/%Y",
            "d/mm/yyyy" => "%e/%m/%Y",
            "d/m/yyyy" => "%e/%c/%Y",
            "dd/mm/yy" => "%d/%m/%y",
            "dd/m/yy" => "%d/%c/%y",
            "d/mm/yy" => "%e/%m/%y",
            "d/m/yy" => "%e/%c/%y",
            "d/m-yy" => "%e/%c-%yy",
            "d/m yyyy" => "%e/%c %Y",
            "dd mmm yyyy" => "%d %b %Y",
            "d mmm yyyy" => "%e %b %Y",
            "dd mmmm yyyy" => "%d %M %Y",
            "d mmmm yyyy" => "%e %M %Y",
            "dd mmm, yyyy" => "%d %b, %Y",
            "d mmm, yyyy" => "%e %b, %Y",
            "dd mmmm, yyyy" => "%d %M, %Y",
            "d mmmm, yyyy" => "%e %M, %Y",
            "dddd, dd mmmm yyyy" => "%W, %d %M %Y",
            "dddd, d mmmm yyyy" => "%W, %e %M %Y",
            "dddd, dd mmm yyyy" => "%W, %d %b %Y",
            "dddd, d mmm yyyy" => "%W, %e %b %Y",
            "ddd, dd mmmm yyyy" => "%a, %d %M %Y",
            "ddd, d mmmm yyyy" => "%a, %e %M %Y",
            "ddd, dd mmm yyyy" => "%a, %d %b %Y",
            "ddd, d mmm yyyy" => "%a, %e %b %Y",
            "dddd, dd mmmm, yyyy" => "%W, %d %M, %Y",
            "dddd, d mmmm, yyyy" => "%W, %e %M, %Y",
            "dddd, dd mmm, yyyy" => "%W, %d %b, %Y",
            "dddd, d mmm, yyyy" => "%W, %e %b, %Y",
            "ddd, dd mmmm, yyyy" => "%a, %d %M, %Y",
            "ddd, d mmmm, yyyy" => "%a, %e %M, %Y",
            "ddd, dd mmm, yyyy" => "%a, %d %b, %Y",
            "ddd, d mmm, yyyy" => "%a, %e %b, %Y",
            "dddd dd mmmm yyyy" => "%W %d %M %Y",
            "dddd d mmmm yyyy" => "%W %e %M %Y",
            "dddd dd mmm yyyy" => "%W %d %b %Y",
            "dddd d mmm yyyy" => "%W %e %b %Y",
            "ddd dd mmmm yyyy" => "%a %d %M %Y",
            "ddd d mmmm yyyy" => "%a %e %M %Y",
            "ddd dd mmm yyyy" => "%a %d %b %Y",
            "ddd d mmm yyyy" => "%a %e %b %Y",
            "dddd dd mmmm, yyyy" => "%W %d %M, %Y",
            "dddd d mmmm, yyyy" => "%W %e %M, %Y",
            "dddd dd mmm, yyyy" => "%W %d %b, %Y",
            "dddd d mmm, yyyy" => "%W %e %b, %Y",
            "ddd dd mmmm, yyyy" => "%a %d %M, %Y",
            "ddd d mmmm, yyyy" => "%a %e %M, %Y",
            "ddd dd mmm, yyyy" => "%a %d %b, %Y",
            "ddd d mmm, yyyy" => "%a %e %b, %Y",
            "dd.mm.yyyy" => "%d.%m.%Y",
            "d.mm.yyyy" => "%e.%m.%Y",
            "dd.m.yyyy" => "%d.%c.%Y",
            "d.m.yyyy" => "%e.%c.%Y",
            "dd. mm. yyyy" => "%d. %m. %Y",
            "d. mm. yyyy" => "%e. %m. %Y",
            "dd. m. yyyy" => "%d. %c. %Y",
            "d. m. yyyy" => "%e. %c. %Y",
            "dd.mm.yy" => "%d.%m.%y",
            "dd.m.yy" => "%d.%c.%y",
            "d.mm.yy" => "%e.%m.%y",
            "d.m.yy" => "%e.%c.%y",
            "dd. mm. yy" => "%d. %m. %y",
            "dd. m. yy" => "%d. %c. %y",
            "d. mm. yy" => "%e. %m. %y",
            "d. m. yy" => "%e. %c. %y",
            "d. mmmm yyyy" => "%e. %M %Y",
            "d. mmm yyyy" => "%e. %b %Y",
            "dd. mmmm yyyy" => "%d. %M %Y",
            "dd. mmm yyyy" => "%d. %b %Y",
            "dd-mm-yyyy" => "%d-%m-%Y",
            "dd-m-yyyy" => "%d-%c-%Y",
            "d-mm-yyyy" => "%e-%m-%Y",
            "d-m-yyyy" => "%e-%c-%Y",
            "dd-mm-yy" => "%d-%m-%y",
            "dd-m-yy" => "%d-%c-%y",
            "d-mm-yy" => "%e-%m-%y",
            "d-m-yy" => "%e-%c-%y",
            //middle-endian (month, day, year)
            "mm/dd/yyyy" => "%m/%d/%Y",
            "mm/d/yyyy" => "%m/%e/%Y",
            "m/dd/yyyy" => "%c/%d/%Y",
            "m/d/yyyy" => "%c/%e/%Y",
            "mm/dd/yy" => "%m/%d/%y",
            "mm/d/yy" => "%m/%e/%y",
            "m/dd/yy" => "%c/%d/%y",
            "m/d/yy" => "%c/%e/%y",
            "mmmm/dd/yyyy" => "%M/%d/%Y",
            "mmmm/d/yyyy" => "%M/%e/%Y",
            "mmm/dd/yyyy" => "%b/%d/%Y",
            "mmm/d/yyyy" => "%b/%e/%Y",
            "mm.dd.yyyy" => "%m.%d.%Y",
            "mm.d.yyyy" => "%m.%e.%Y",
            "m.dd.yyyy" => "%c.%d.%Y",
            "m.d.yyyy" => "%c.%e.%Y",
            "mm. dd. yyyy" => "%m. %d. %Y",
            "mm. d. yyyy" => "%m. %e. %Y",
            "m. dd. yyyy" => "%c. %d. %Y",
            "m. d. yyyy" => "%c. %e. %Y",
            "dddd mmmm dd yyyy" => "%W %M %d %Y",
            "dddd mmmm d yyyy" => "%W %M %e %Y",
            "dddd mmm dd yyyy" => "%W %b %d %Y",
            "dddd mmm d yyyy" => "%W %b %e %Y",
            "ddd mmmm dd yyyy" => "%a %M %d %Y",
            "ddd mmmm d yyyy" => "%a %M %e %Y",
            "ddd mmm dd yyyy" => "%a %b %d %Y",
            "ddd mmm d yyyy" => "%a %b %e %Y",
            "dddd, mmmm dd yyyy" => "%W, %M %d %Y",
            "dddd, mmmm d yyyy" => "%W, %M %e %Y",
            "dddd, mmm dd yyyy" => "%W, %b %d %Y",
            "dddd, mmm d yyyy" => "%W, %b %e %Y",
            "ddd, mmmm dd yyyy" => "%a, %M %d %Y",
            "ddd, mmmm d yyyy" => "%a, %M %e %Y",
            "ddd, mmm dd yyyy" => "%a, %b %d %Y",
            "ddd, mmm d yyyy" => "%a, %b %e %Y",
            "dddd, mmmm dd, yyyy" => "%W, %M %d, %Y",
            "dddd, mmmm d, yyyy" => "%W, %M %e, %Y",
            "dddd, mmm dd, yyyy" => "%W, %b %d, %Y",
            "dddd, mmm d, yyyy" => "%W, %b %e, %Y",
            "ddd, mmmm dd, yyyy" => "%a, %M %d, %Y",
            "ddd, mmmm d, yyyy" => "%a, %M %e, %Y",
            "ddd, mmm dd, yyyy" => "%a, %b %d, %Y",
            "ddd, mmm d, yyyy" => "%a, %b %e, %Y",
            "mmmm dd, yyyy" => "%M %d, %Y",
            "mmmm d, yyyy" => "%M %e, %Y",
            "mmm dd, yyyy" => "%b %d, %Y",
            "mmm d, yyyy" => "%b %e, %Y",
            "mm-dd-yyyy" => "%m-%d-%Y",
            "mm-d-yyyy" => "%m-%e-%Y",
            "m-dd-yyyy" => "%c-%d-%Y",
            "m-d-yyyy" => "%c-%e-%Y",
            "mm-dd-yy" => "%m-%d-%y",
            "mm-d-yy" => "%m-%e-%y",
            "m-dd-yy" => "%c-%d-%y",
            "m-d-yy" => "%c-%e-%y",
            "mmmm-dd-yyyy" => "%M-%d-%Y",
            "mmmm-d-yyyy" => "%M-%e-%Y",
            "mmm-dd-yyyy" => "%b-%d-%Y",
            "mmm-d-yyyy" => "%b-%e-%Y"
        ];
    }

    private function getCardKey($multipletype) {
        return preg_replace('/\s+/', '', strtolower($multipletype['name']));
    }

    private function isConcatenated($multipletype) {
        if(array_key_exists("concatenated", $multipletype)) {
            return true;
        }
        return false;
    }

    private function isJoined($firstfield) {
        if(array_key_exists("join", $firstfield)) {
            return true;
        }
        return false;
    }

    private function formSingles($multipletype, $datatype) {
        if(array_key_exists("attribute", $multipletype)) {
            if($datatype === 'datetypes' || $datatype === 'datetimetypes' || $datatype === 'timetypes') {
                if($datatype === 'datetypes')
                    return [
                        $multipletype['attribute'],
                        $multipletype['table'],
                        $datatype,
                        ['dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]
                    ];
                else if($datatype === 'datetimetypes')
                    return [
                        $multipletype['attribute'],
                        $multipletype['table'],
                        $datatype, 
                        [
                            'timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]], 
                            'dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]
                        ]
                    ];
                else
                    return [
                        $multipletype['attribute'],
                        $multipletype['table'],
                        $datatype, 
                        ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]]]
                    ];
            }
            else {
                return [
                    $multipletype['attribute'],
                    $multipletype['table'],
                    $datatype
                ];
            }
        }
        else {
            if($datatype === 'datetypes' || $datatype === 'datetimetypes' || $datatype === 'timetypes') {
                if($datatype === 'datetypes')
                    return [
                        $multipletype['table'],
                        $datatype,
                        ['dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]
                    ];
                else if($datatype === 'datetimetypes')
                    return [
                        $multipletype['table'],
                        $datatype, 
                        [
                            'timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]], 
                            'dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]
                        ]
                    ];
                else
                    return [
                        $multipletype['table'],
                        $datatype, 
                        ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]]]
                    ];
            }
            else {
                return [
                    $multipletype['table'],
                    $datatype
                ];
            }
        }
    }

    private function formJoinWithoutConcatenation($multipletype, $clusters, $datatype) {
        $field = preg_replace('/\s+/', '', strtolower($multipletype['name']));
        if(array_key_exists("attribute", $multipletype)) {
            $field = $multipletype['attribute'];
        }
        $clusterlink = [$multipletype['join'], $multipletype['table']];
        $tableHolder = [];
        foreach($clusters as $cluster) {
            if($cluster[0] === $clusterlink) {
                $tableAndJoinKey = [];
                $tableAndJoinKey[] = [$clusterlink[0], $cluster[1][0]];
                $tableAndJoinKey[] = [$clusterlink[1], $cluster[1][1]];
                $tableHolder = $tableAndJoinKey;
            }
        }
        if($datatype === 'datetypes' || $datatype === 'datetimetypes' || $datatype === 'timetypes') {
            if($datatype === 'datetypes')
                return [$field, $tableHolder, $datatype, ['dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]];
            else if($datatype === 'datetimetypes')
                return [$field, $tableHolder, $datatype, ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]], 'dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]];
            else
                return [$field, $tableHolder, $datatype, ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]]]];
        }
        else {
            return [$field, $tableHolder, $datatype];
        }
    }

    private function attachModifiersOrNot($datatype, $fields) {
        if($datatype === 'numberstringtypes' || $datatype === 'singlewordstringtypes') {
            if(array_key_exists("startmodifierwildcard", $fields) || array_key_exists("endmodifierwildcard", $fields)) {
                if(array_key_exists("startmodifierwildcard", $fields) && array_key_exists("endmodifierwildcard", $fields)) {
                    if(array_key_exists('attribute', $fields)) {
                        return "'".$fields['startmodifierwildcard']."', ".$fields['attribute'].", '".$fields['endmodifierwildcard']."'";
                    }
                    else {
                        return "'".$fields['startmodifierwildcard']."', ".preg_replace('/\s+/', '', strtolower($fields['name'])).", '".$fields['endmodifierwildcard']."'";
                    }
                }
                else {
                    if(array_key_exists("startmodifierwildcard", $fields)) {
                        if(array_key_exists('attribute', $fields)) {
                            return "'".$fields['startmodifierwildcard']."', ".$fields['attribute'];
                        }
                        else {
                            return "'".$fields['startmodifierwildcard']."', ".preg_replace('/\s+/', '', strtolower($fields['name']));
                        }
                    }
                    else {
                        if(array_key_exists('attribute', $fields)) {
                            return $fields['attribute'].", '".$fields['endmodifierwildcard']."'";
                        }
                        else {
                            return preg_replace('/\s+/', '', strtolower($fields['name'])).", '".$fields['endmodifierwildcard']."'";
                        }
                    }
                }
            }
            else {
                if(array_key_exists('attribute', $fields)) {
                    return $fields['attribute'];
                }
                else {
                    return preg_replace('/\s+/', '', strtolower($fields['name']));
                }
            }
        }
        else {
            if(array_key_exists('attribute', $fields)) {
                return $fields['attribute'];
            }
            else {
                return preg_replace('/\s+/', '', strtolower($fields['name']));
            }
        }
    }

    private function isOnlySameTableAndJoinPairInCluster($fields) {
        $sametableandjoinpairs = true;
        for($i = 1; $i < count($fields); $i++) {
            if($fields[0]['join'] !== $fields[$i]['join'] || $fields[0]['table'] !== $fields[$i]['table']) {
                $sametableandjoinpairs = false;
                break;
            }
        }
        return $sametableandjoinpairs;
    }

    private function isDuplicateTableAndJoinPairInCluster($fields) {
        $duplicates = [];
        for($i = 0; $i < count($fields) - 1; $i++) {
            $count = 0;
            for($j = $i+1; $j < count($fields); $j++) {
                if($fields[$i]['join'] === $fields[$j]['join'] && $fields[$i]['table'] === $fields[$j]['table']) {
                    $count++;
                }
            }
            if($count > 0) {
                $found = false;
                if(count($duplicates) > 0) {
                    foreach($duplicates as $duplicate) {
                        if($duplicate === [$fields[$i]['join'], $fields[$i]['table']]) {
                            $found = true;
                            break;
                        }
                    }
                }
                if($found === false) {
                    $duplicates[] = [$fields[$i]['join'], $fields[$i]['table']];
                }
            }
        }
        if(count($duplicates) > 0) {
            return [true, $duplicates];
        }
        else {
            return [false, $duplicates];
        }
    }

    private function formConcatenationViaOrWithoutJoin($multipletype, $concatenationtype, $clusters, $datatype) {
        $fields = $multipletype['concatenated']['fields'];
        $delimiters = $multipletype['concatenated']['delimiters'];
        $pairHolder = [];
        
        for($i = 0; $i < count($fields); $i++) {
            $pairHolder[] = $this->attachModifiersOrNot($datatype, $fields[$i]);
            
            if(is_array($delimiters)) {
            	if(count($delimiters) === 1) {
                    if($i<count($fields)-1) {
                        $pairHolder[] = ", '$delimiters[0]', ";
                    }
            	}
            	else {
                    if($i<count($delimiters)) {
                        $pairHolder[] = ", '$delimiters[$i]', ";
                    }
               }
            }
            else {
                if($i<count($fields)-1) {
                    $pairHolder[] = ", '$delimiters', ";
                }
            }
        }
        if($concatenationtype === 'CONCATENATION-VIA-JOIN') {
            $tableHolder = [];
            if($this->isOnlySameTableAndJoinPairInCluster($fields)) {
                foreach($clusters as $cluster) {
                    $clusterlink1 = [$fields[0]['join'], $fields[0]['table']];
                    $clusterlink2 = [$fields[0]['table'], $fields[0]['join']];
                    if($cluster[0] === $clusterlink1 || $cluster[0] === $clusterlink2) {
                        $tableAndJoinKey = [];
                        if($cluster[0] === $clusterlink1) {
                            $tableAndJoinKey[] = [$fields[0]['join'], $cluster[1][0]];
                            $tableAndJoinKey[] = [$fields[0]['table'], $cluster[1][1]];
                        }
                        else {
                            $tableAndJoinKey[] = [$fields[0]['table'], $cluster[1][0]];
                            $tableAndJoinKey[] = [$fields[0]['join'], $cluster[1][1]];
                        }
                        $tableHolder = $tableAndJoinKey;
                        break;
                    }
                }
            }
            else {
                $isduplicate = $this->isDuplicateTableAndJoinPairInCluster($fields);
                if($isduplicate[0]) {
                    foreach($clusters as $cluster) {
                        foreach($isduplicate[1] as $duplicate) {
                            if($cluster[0] === $duplicate || $cluster[0] === [$duplicate[1], $duplicate[0]]) {
                                $tableAndJoinKey = [];
                                if($cluster[0] === $duplicate) {
                                    $tableAndJoinKey[] = [$duplicate[0], $cluster[1][0]];
                                    $tableAndJoinKey[] = [$duplicate[1], $cluster[1][1]];
                                }
                                else {
                                    $tableAndJoinKey[] = [$duplicate[1], $cluster[1][0]];
                                    $tableAndJoinKey[] = [$duplicate[0], $cluster[1][1]];
                                }
                                $found = false;
                                foreach($tableHolder as $th) {
                                    if($th === $tableAndJoinKey) {
                                        $found = true;
                                        break;
                                    }
                                }
                                if($found === false) {
                                    $tableHolder[] = $tableAndJoinKey;
                                }
                                break;
                            }
                        }
                    }
                    for($i = 0; $i < count($fields); $i++) {
                        $found = false;
                        foreach($isduplicate[1] as $duplicate) {
                            if(
                                ($fields[$i]['join'] === $duplicate[0] && $fields[$i]['table'] === $duplicate[1])
                                ||
                                ($fields[$i]['join'] === $duplicate[1] && $fields[$i]['table'] === $duplicate[0])
                            ) {
                                $found = true;
                                break;
                            }
                        }
                        if($found === false) {
                            $clusterlink1 = [$fields[$i]['join'], $fields[$i]['table']];
                            $clusterlink2 = [$fields[$i]['table'], $fields[$i]['join']];
                            foreach($clusters as $cluster) {
                                if($cluster[0] === $clusterlink1 || $cluster[0] === $clusterlink2) {
                                    $tableAndJoinKey = [];
                                    if($cluster[0] === $clusterlink1) {
                                        $tableAndJoinKey[] = [$clusterlink1[0], $cluster[1][0]];
                                        $tableAndJoinKey[] = [$clusterlink1[1], $cluster[1][1]];
                                    }
                                    else {
                                        $tableAndJoinKey[] = [$clusterlink2[0], $cluster[1][0]];
                                        $tableAndJoinKey[] = [$clusterlink2[1], $cluster[1][1]];
                                    }
                                    $foundHolder = false;
                                    foreach($tableHolder as $th) {
                                        if($th === $tableAndJoinKey) {
                                            $foundHolder = true;
                                            break;
                                        }
                                    }
                                    if($foundHolder === false) {
                                        $tableHolder[] = $tableAndJoinKey;
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    for($i = 0; $i < count($fields); $i++) {
                        $clusterlink1 = [$fields[$i]['join'], $fields[$i]['table']];
                        $clusterlink2 = [$fields[$i]['table'], $fields[$i]['join']];
                        foreach($clusters as $cluster) {
                            if($cluster[0] === $clusterlink1 || $cluster[0] === $clusterlink2) {
                                $tableAndJoinKey = [];
                                if($cluster[0] === $clusterlink1) {
                                    $tableAndJoinKey[] = [$clusterlink1[0], $cluster[1][0]];
                                    $tableAndJoinKey[] = [$clusterlink1[1], $cluster[1][1]];
                                }
                                else {
                                    $tableAndJoinKey[] = [$clusterlink2[0], $cluster[1][0]];
                                    $tableAndJoinKey[] = [$clusterlink2[1], $cluster[1][1]];
                                }
                                $foundHolder = false;
                                foreach($tableHolder as $th) {
                                    if($th === $tableAndJoinKey) {
                                        $foundHolder = true;
                                        break;
                                    }
                                }
                                if($foundHolder === false) {
                                    $tableHolder[] = $tableAndJoinKey;
                                }
                            }
                        }
                    }
                }
            }

            if($datatype === 'datetypes' || $datatype === 'datetimetypes' || $datatype === 'timetypes') {
                if($datatype === 'datetypes')
                    return [$pairHolder, $tableHolder, $datatype,['dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]];
                else if($datatype === 'datetimetypes')
                    return [$pairHolder, $tableHolder, $datatype,['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]], 'dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]];
                else
                    return [$pairHolder, $tableHolder, $datatype, ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]]]];
            }
            else {
                return [$pairHolder, $tableHolder, $datatype];
            }
        }
        else {
            if($datatype === 'datetypes' || $datatype === 'datetimetypes' || $datatype === 'timetypes') {
                if($datatype === 'datetypes')
                    return [$pairHolder, $fields[0]['table'], $datatype, ['dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]];
                else if($datatype === 'datetimetypes')
                    return [$pairHolder, $fields[0]['table'], $datatype, ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]], 'dateformat' => $this->mysqlDateFormatMap()[$multipletype["dateFormat"]]]];
                else
                    return [$pairHolder, $fields[0]['table'], $datatype, ['timeformat' => $this->mysqlTimeFormatMap()[$multipletype["timeFormat"]]]];
            }
            else {
                return [$pairHolder, $fields[0]['table'], $datatype];
            }
        }
    }

    private function createCardsForClustersWithinTheSameDB($dbkey, $config, $cluster) {
        $cards = [];
        $clusters = $this->reconstructClusters($dbkey, $cluster);
        foreach($config as $key => $value) {
            foreach($value as $multipletype) {
                $cardkey = $this->getCardKey($multipletype);
                if($this->isConcatenated($multipletype)) {
                    if($this->isJoined($multipletype['concatenated']['fields'][0])) {
                        //concatenation via join
                        $cards["$cardkey"] = [
                            'concatenation_via_join' => $this->formConcatenationViaOrWithoutJoin($multipletype, 'CONCATENATION-VIA-JOIN', $clusters, $key)
                        ];
                    }
                    else {
                        //concatenation without join
                        $cards["$cardkey"] = [
                            'concatenation_without_join' => $this->formConcatenationViaOrWithoutJoin($multipletype, 'CONCATENATION-WITHOUT-JOIN', $clusters, $key)
                        ];
                    }
                }
                else {
                    if($this->isJoined($multipletype)) {
                        //join without concatenation
                        $cards["$cardkey"] = [
                            'join_without_concatenation' => $this->formJoinWithoutConcatenation($multipletype, $clusters, $key)
                        ];
                    }
                    else {
                        //no join no concatenation = single
                        $cards["$cardkey"] = [
                            'single' => $this->formSingles($multipletype, $key)
                        ];
                    }
                }
            }
        }
        return $cards;
    }
    
    private function formConcatString($pointers) {
        $index = 0;
        $concatenation = 'concat(';
        foreach($pointers as $pointer) {
            $concatenation.=$pointers[$index];
            $index++;
            if($index === count($pointers)) {
                $concatenation.=')';
            }
        }
        return $concatenation;
    }

    private function formColumnJoinString($pointer1) {
        $tablejoin = '';
        foreach($pointer1 as $pointer) {
            if($tablejoin === '') {
                if(!is_array($pointer[0])) {
                    $tablejoin.=$pointer1[0][0].' inner join '.$pointer1[1][0].' on '.$pointer1[0][0].'.'.$pointer1[0][1].' = '.$pointer1[1][0].'.'.$pointer1[1][1];
                    break;
                }
                else {
                    $tablejoin.=$pointer[0][0].' inner join '.$pointer[1][0].' on '.$pointer[0][0].'.'.$pointer[0][1].' = '.$pointer[1][0].'.'.$pointer[1][1];
                }
            }
            else {
                $tablejoin.=' inner join '.$pointer[1][0].' on '.$pointer[0][0].'.'.$pointer[0][1].' = '.$pointer[1][0].'.'.$pointer[1][1];
            }
        }
        return $tablejoin;
    }

    public function getCardDistinctRecord() {

        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: *');

        $distinctrecords = [];

	    $config = json_decode($this->request->getPost('config'), true);

        //print_r($config);

        $clusters = $this->findClustersWithinTheSameDBAndInterDBRelatedClusters($config);

        //print_r($clusters);

        if(count($clusters['INTER-DB-RELATED-CLUSTERS']) > 0) {
            print_r($clusters['INTER-DB-RELATED-CLUSTERS']);
            //createCardsForInterRelatedClusters($clusters['INTER-DB-RELATED-CLUSTERS'])
            foreach($clusters['INTER-DB-RELATED-CLUSTERS'] as $interdbrelatedclusters) {

            }
        }

        if(count($clusters['CLUSTERS-WITHIN-THE-SAME-DB']) > 0) {
            foreach($clusters['CLUSTERS-WITHIN-THE-SAME-DB'] as $dbkey => $dbcluster) {

                $this->cards = $this->createCardsForClustersWithinTheSameDB($dbkey, $dbcluster, $this->clusters);

                //print_r($this->cards);

                $db = \Config\Database::connect($this->multipledbconnectionwithtableandalias[$dbkey]['connection']);

                foreach($this->cards as $key => $value) {
            
                    $sql = '';

                    $maxminsql = '';

                    $datatype = '';

                    if(array_key_exists('concatenation_via_join', $value)) {
                        //concatenation via join

                        $datatype = $value['concatenation_via_join'][2];

                        $concatenation = $this->formConcatString($value['concatenation_via_join'][0]);
                        $tablejoin = $this->formColumnJoinString($value['concatenation_via_join'][1]);
                        $sql = "SELECT DISTINCT $concatenation AS 'row' from $tablejoin";
                        
                        if($datatype==='numberstringtypes' || $datatype==='timetypes' || $datatype==='datetypes' || $datatype==='datetimetypes' || $datatype==='numbertypes' || $datatype==='yeartypes') {
                            $maxminsql = "SELECT MAX(".$concatenation.") AS 'max', MIN(".$concatenation.") as 'min' from ".$tablejoin;
                        }
                    }
                    else if(array_key_exists('concatenation_without_join', $value)) {
                        //concatenation without join

                        $datatype = $value['concatenation_without_join'][2];

                        $concatenation = $this->formConcatString($value['concatenation_without_join'][0]);
                        $sql = "SELECT DISTINCT $concatenation AS 'row' from ".$value['concatenation_without_join'][1];
                        
                        if($datatype==='numberstringtypes' || $datatype==='timetypes' || $datatype==='datetypes' || $datatype==='datetimetypes' || $datatype==='numbertypes' || $datatype==='yeartypes') {
                            $maxminsql = "SELECT MAX(".$concatenation.") AS 'max', MIN(".$concatenation.") as 'min' from ".$tablejoin;
                        }
                    }
                    else if(array_key_exists('join_without_concatenation', $value)) {
                        //join_without_concatenation

                        $datatype = $value['join_without_concatenation'][2];

                        $tablejoin = $this->formColumnJoinString($value['join_without_concatenation'][1]);

                        if($datatype === 'timetypes' || $datatype === 'datetypes' || $datatype === 'datetimetypes') {
                            if($datatype === 'timetypes') {
                                $timeFormat = $value['join_without_concatenation'][3]['timeformat'];
                                $field = $value['join_without_concatenation'][0];

                                $maxminsql = "SELECT DATE_FORMAT(MAX($field), $timeFormat)) AS 'max', DATE_FORMAT(MIN($field), $timeFormat)) as 'min' from $tablejoin";
                                $sql = "SELECT DISTINCT DATE_FORMAT($field, '$timeFormat') AS 'row' from $tablejoin";
                            }
                            else if($datatype === 'datetypes') {
                                $dateFormat = $value['join_without_concatenation'][3]['dateformat'];
                                $field = $value['join_without_concatenation'][0];

                                $maxminsql = "SELECT DATE_FORMAT(MAX($field), '%Y-%m-%d')) AS 'max', DATE_FORMAT(MIN($field), '%Y-%m-%d')) as 'min' from $tablejoin";
                                $sql = "SELECT DISTINCT DATE_FORMAT($field, '$dateFormat') AS 'row' from $tablejoin";
                            }
                            else {
                                $datetimeFormat = $value['join_without_concatenation'][3]['dateformat'].'__O__'.$value['join_without_concatenation'][3]['timeformat'];
                                $field = $value['join_without_concatenation'][0];

                                $maxminsql = "SELECT DATE_FORMAT(MAX($field), '%Y-%m-%d')) AS 'max', DATE_FORMAT(MIN($field), '%Y-%m-%d')) as 'min' from $tablejoin";
                                $sql = "SELECT DISTINCT DATE_FORMAT($field, '$datetimeFormat') AS 'row' from $tablejoin";
                            }
                        }
                        else {
                            $sql = 'SELECT DISTINCT '.$value['join_without_concatenation'][0]." AS 'row' from $tablejoin";
                        
                            if($datatype==='numberstringtypes' || $datatype==='numbertypes' || $datatype==='yeartypes') {
                                $maxminsql = "SELECT MAX(".
                                    $value['join_without_concatenation'][0].
                                ") AS 'max', MIN(".
                                    $value['join_without_concatenation'][0].
                                ") as 'min' from ".$tablejoin;
                            }
                        }
                    }
                    else {
                        if(count($value['single']) === 2) {
                            $datatype = $value['single'][1];

                            $sql = "SELECT DISTINCT $key AS 'row' from ".$value['single'][0];

                            if($datatype==='numberstringtypes' || $datatype==='numbertypes' || $datatype==='yeartypes') {
                                $maxminsql = "SELECT MAX($key) AS 'max', MIN($key) as 'min' from ".$value['single'][0];
                            }
                        }
                        else {
                            $field = "";
                            $table = "";
                            if(count($value['single']) === 3) {
                                if(is_array($value['single'][2])) {
                                    $datatype = $value['single'][1];
                                    $field = $key;
                                    $table = $value['single'][0];
                                }
                                else {
                                    $datatype = $value['single'][2];
                                    $field = $value['single'][0];
                                    $table = $value['single'][1];
                                }
                            }
                            else {
                                $datatype = $value['single'][2];
                                $field = $value['single'][0];
                                $table = $value['single'][1];
                            }

                            if($datatype === 'timetypes' || $datatype === 'datetypes' || $datatype === 'datetimetypes') {
                                if($datatype === 'timetypes') {
                                    $timeFormat = $value['single'][count($value['single'])-1]['timeformat'];
                                    $sql = "SELECT DISTINCT DATE_FORMAT($field, '$timeFormat') AS 'row' from $table";
                                    $maxminsql = "SELECT DATE_FORMAT(MAX($field), '$timeFormat') AS 'max', DATE_FORMAT(MIN($field), '$timeFormat') as 'min' from $table";
                                }
                                else if($datatype === 'datetypes') {
                                    $dateFormat = $value['single'][count($value['single'])-1]['dateformat'];
                                    $sql = "SELECT DISTINCT DATE_FORMAT($field, '$dateFormat') AS 'row' from $table";
                                    $maxminsql = "SELECT DATE_FORMAT(MAX($field), '%Y-%m-%d') AS 'max', DATE_FORMAT(MIN($field), '%Y-%m-%d') as 'min' from $table";
                                }
                                else {
                                    $datetimeFormat = $value['single'][count($value['single'])-1]['dateformat'].'__O__'.$value['single'][count($value['single'])-1]['timeformat'];
                                    $sql = "SELECT DISTINCT DATE_FORMAT($field, '$datetimeFormat') AS 'row' from $table";
                                    $maxminsql = "SELECT DATE_FORMAT(MAX($field), '%Y-%m-%d') AS 'max', DATE_FORMAT(MIN($field), '%Y-%m-%d') as 'min' from $table";
                                }
                            }
                            else {
                                $sql = "SELECT DISTINCT $field AS 'row' from $table";
                                if($datatype==='numberstringtypes' || $datatype==='numbertypes' || $datatype==='yeartypes') {
                                    $maxminsql = "SELECT MAX($field) AS 'max', MIN($field) as 'min' from $table";
                                }
                            }
                        }
                    }
                    
                    /*
                    print_r("\n==================\n");
                    print_r($sql);
                    print_r("\n==================\n");
                    print_r($maxminsql);
                    print_r("\n==================\n");
                    */

                    $query = $db->query($sql);
                        
                    $data = [];

                    foreach($query->getResult() as $r) {
                        $data[] = [
                            'row' => $r->row,
                            'checked' => false,
                            'selected' => false
                        ];
                    }
            
                    if($datatype==='numberstringtypes' || $datatype==='timetypes' || $datatype==='datetypes' || $datatype==='datetimetypes' || $datatype==='numbertypes' || $datatype==='yeartypes') {
                        $query1 = $db->query($maxminsql);
                        $distinctrecords["$key"] = [
                            'data' => $data,
                            'total' => count($query->getResult()),
                            'offset' => 2,
                            'max' => $query1->getResult()[0]->max,
                            'min' => $query1->getResult()[0]->min
                        ];
                    }
                    else {
                        $distinctrecords["$key"] = [
                            'data' => $data,
                            'total' => count($query->getResult()),
                            'offset' => 2
                        ];
                    }
                }
                
                $db->close();
            }
        }

	    return $this->respond($distinctrecords);        
    }
}