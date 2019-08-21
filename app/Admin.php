<?php

namespace OrlandoLibardi\OlCms\AdminCms\app;


use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{

    protected $table = "admin_pages";
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'route', 'icon', 'parent_id', 'minimun_can', 'order_at'
    ];


    public function childs(){
        return $this->hasMany('OrlandoLibardi\OlCms\AdminCms\app\Admin', 'parent_id', 'id');
    }

    
}