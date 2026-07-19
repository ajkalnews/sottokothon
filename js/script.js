
    function switchModernTab(event, tabId) {
    // সব প্যানেল হাইড করা
    const panes = document.querySelectorAll('.mi-modern-pane');
    panes.forEach(pane => pane.classList.remove('active'));

    // সব বাটন থেকে একটিভ ক্লাস রিমুভ করা
    const buttons = document.querySelectorAll('.mi-modern-tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // নির্দিষ্ট প্যানেল ও বাটন একটিভ করা
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}
