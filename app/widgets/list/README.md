List
====

Angular directive for lists. A number of list items are rendered into the dom and are reused while scrolling through the list.

Example:
```html
<aw-list items="items">
  <div name="ListItem">
    <label>{{ item.label }}</label>
    <input />
    <span>{{ item.text }}</span>
  </div>
</aw-list>
```

In the example above, the scope variable 'items' is an array containing the items to display in the list. The HTML code within the `aw-list` tag is repeated for every item. The 'item' scope variable contains the item for the list item.
