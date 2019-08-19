@foreach($childs as $child)
    <li>
        <a href="{{ Route($child->route) }}">{{ $child->name }}</a>
    </li>
@endforeach