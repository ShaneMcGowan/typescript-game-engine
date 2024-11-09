# Engine
- Object instanciation for a map should be done via a JSON file, rather than hard coded with classes, that way the editor can be enabled to be more powerful.

# Editor
Editor is currently very limited
- Enable scene preview
- Enable object additions via the Editor
- Rename "engine" folder to Editor as that is what it is, engine is the underly code
- Background Editor - "Background Editor" to create multilayer backgrounds easily with a JSON file which imports directly into a game

# Client
- Base resolution should be 1920x1080

# Game Objects
- Game Objects should be hierarchal

E.g. allowing for a structure as follows
```
A.Children[0].Children[0].Children[0];
```