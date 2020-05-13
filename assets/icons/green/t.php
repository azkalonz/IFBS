<?php
$dir = new DirectoryIterator(dirname(__FILE__));
foreach ($dir as $fileinfo) {
    if (!$fileinfo->isDot()) {
        $f = substr($fileinfo,0,strpos($fileinfo,'.'));
        $a = explode('-',$f,2);
        $a = str_replace('-','',$a);
        $a = sizeof($a)>1?$a[0].ucfirst($a[1]):$a[0];
        $a = ucfirst($a);
        if($a=='t') continue;
        echo "import {$a} from '../../assets/icons/{$f}.svg';<br>";
    }
}
echo 'export {';
foreach ($dir as $fileinfo) {
    if (!$fileinfo->isDot()) {
        $f = substr($fileinfo,0,strpos($fileinfo,'.'));
        $a = explode('-',$f);
        $a = explode('-',$f,2);
        $a = str_replace('-','',$a);
        $a = sizeof($a)>1?$a[0].ucfirst($a[1]):$a[0];
        $a = ucfirst($a);
        if($a=='t') continue;
        echo "{$a},";
    }
}
echo '};';