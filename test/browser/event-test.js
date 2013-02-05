function click(element) {
    if (document.createEvent) {
        var event = document.createEvent("MouseEvents");
        event.initEvent("click", true, false);
        element.dispatchEvent(event);
    } else if (document.createEventObject) {
        element.fireEvent("onclick");
    } else {
        buster.log("Uh-oh, no way to simulate click");
    }
}

buster.testCase("Cull DOM events", {
    "adds event handler": function () {
        var handler = this.spy();
        var el = cull.dom.el("button", { events: { click: handler } });

        click(el);

        assert.calledOnce(handler);
    }
});
