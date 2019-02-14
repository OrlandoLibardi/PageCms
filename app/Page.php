<?php

namespace OrlandoLibardi\PageCms\app;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'alias', 'content', 'status', 'meta_title', 'meta_description', 'meta_image'
    ];
}
