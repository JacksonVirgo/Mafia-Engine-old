function absolute(base, relative) {
    if (!base && !relative) {
        return null;
    }
    var stack = base.split("/"), parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
    // (omit if "base" is the current folder without trailing slash)
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
}

module.exports = {
    absolute
}