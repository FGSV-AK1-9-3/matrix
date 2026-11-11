/**
 * Custom multiline dropdowns.
 *
 * Progressively enhances every <select class="form-select"> with a button +
 * listbox whose options wrap onto several lines (native <option>s cut off long
 * text). The native <select> stays in the DOM (visually hidden) and remains the
 * single source of truth, so existing code that reads `select.value`, listens
 * for `change`, toggles `disabled` / `is-valid` / `is-invalid`, or resets the
 * form keeps working unchanged.
 */
(() => {
  const valueDescriptor = Object.getOwnPropertyDescriptor(
    HTMLSelectElement.prototype,
    'value',
  );

  const clean = (text) => text.replace(/\s+/g, ' ').trim();

  let uid = 0;
  let openInstance = null;

  function enhance(select) {
    if (select.dataset.customSelect) return;
    select.dataset.customSelect = 'true';

    const id = `cs-${++uid}`;
    const options = Array.from(select.options);

    // ── Build DOM ───────────────────────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.className = 'cs';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'form-select cs-trigger';
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', `${id}-list`);
    if (select.required) trigger.setAttribute('aria-required', 'true');

    const label = document.querySelector(`label[for="${select.id}"]`);
    if (label) {
      if (!label.id) label.id = `${id}-label`;
      trigger.setAttribute('aria-labelledby', label.id);
    }

    const triggerText = document.createElement('span');
    triggerText.className = 'cs-text';
    trigger.appendChild(triggerText);

    const list = document.createElement('ul');
    list.className = 'cs-list';
    list.id = `${id}-list`;
    list.setAttribute('role', 'listbox');
    list.tabIndex = -1;
    list.hidden = true;

    const items = options.map((opt, i) => {
      const li = document.createElement('li');
      li.className = 'cs-option';
      li.id = `${id}-opt-${i}`;
      li.setAttribute('role', 'option');
      li.dataset.value = opt.value;
      li.textContent = clean(opt.textContent);
      if (opt.value === '') li.classList.add('cs-placeholder');
      list.appendChild(li);
      return li;
    });

    select.parentNode.insertBefore(wrapper, select);
    wrapper.append(select, trigger, list);
    select.classList.add('cs-native');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    // ── State ───────────────────────────────────────────────────────────────
    let activeIndex = -1;

    function selectedIndex() {
      return select.selectedIndex;
    }

    function sync() {
      const idx = selectedIndex();
      const opt = options[idx];
      const isPlaceholder = !opt || opt.value === '';
      triggerText.textContent = opt ? clean(opt.textContent) : '';
      trigger.classList.toggle('cs-is-placeholder', isPlaceholder);
      trigger.disabled = select.disabled;
      trigger.classList.toggle(
        'is-valid',
        select.classList.contains('is-valid'),
      );
      trigger.classList.toggle(
        'is-invalid',
        select.classList.contains('is-invalid'),
      );
      items.forEach((li, i) => {
        li.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        li.classList.toggle('cs-selected', i === idx);
      });
    }

    function setActive(index, scroll = true) {
      activeIndex = index;
      items.forEach((li, i) => li.classList.toggle('cs-active', i === index));
      if (index >= 0) {
        trigger.setAttribute('aria-activedescendant', items[index].id);
        if (scroll) items[index].scrollIntoView({ block: 'nearest' });
      } else {
        trigger.removeAttribute('aria-activedescendant');
      }
    }

    function position() {
      list.classList.remove('cs-up');
      const rect = trigger.getBoundingClientRect();
      const listHeight = list.offsetHeight;
      const below = window.innerHeight - rect.bottom;
      const above = rect.top;
      if (below < listHeight + 8 && above > below) list.classList.add('cs-up');
      // Constrain height to the space actually available.
      const space = Math.max(below, above) - 12;
      list.style.maxHeight = `${Math.max(140, Math.min(360, space))}px`;
    }

    function open() {
      if (trigger.disabled || !list.hidden) return;
      if (openInstance && openInstance !== api) openInstance.close();
      list.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      position();
      setActive(Math.max(selectedIndex(), 0));
      openInstance = api;
    }

    function close(returnFocus = false) {
      if (list.hidden) return;
      list.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      setActive(-1, false);
      if (openInstance === api) openInstance = null;
      if (returnFocus) trigger.focus();
    }

    function choose(index) {
      const changed = select.selectedIndex !== index;
      select.selectedIndex = index;
      sync();
      close(true);
      if (changed) {
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    const api = { close, sync };

    // ── Events ──────────────────────────────────────────────────────────────
    trigger.addEventListener('click', () => (list.hidden ? open() : close()));

    list.addEventListener('mousedown', (e) => e.preventDefault()); // keep focus
    list.addEventListener('click', (e) => {
      const li = e.target.closest('.cs-option');
      if (li) choose(items.indexOf(li));
    });
    list.addEventListener('mousemove', (e) => {
      const li = e.target.closest('.cs-option');
      if (li) {
        const i = items.indexOf(li);
        if (i !== activeIndex) setActive(i, false);
      }
    });

    let typed = '';
    let typedTimer;
    trigger.addEventListener('keydown', (e) => {
      const isOpen = !list.hidden;
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp': {
          e.preventDefault();
          if (!isOpen) {
            open();
            break;
          }
          const dir = e.key === 'ArrowDown' ? 1 : -1;
          setActive(Math.min(items.length - 1, Math.max(0, activeIndex + dir)));
          break;
        }
        case 'Home':
          if (isOpen) {
            e.preventDefault();
            setActive(0);
          }
          break;
        case 'End':
          if (isOpen) {
            e.preventDefault();
            setActive(items.length - 1);
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen) choose(activeIndex >= 0 ? activeIndex : selectedIndex());
          else open();
          break;
        case 'Escape':
          if (isOpen) {
            e.preventDefault();
            e.stopPropagation();
            close(true);
          }
          break;
        case 'Tab':
          close();
          break;
        default:
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            // Type-ahead: jump to the first option starting with typed text.
            typed += e.key.toLowerCase();
            clearTimeout(typedTimer);
            typedTimer = setTimeout(() => (typed = ''), 600);
            const hit = items.findIndex((li) =>
              li.textContent.toLowerCase().startsWith(typed),
            );
            if (hit >= 0) {
              if (!isOpen) open();
              setActive(hit);
            }
          }
      }
    });

    // Clicking the <label> should focus the custom control.
    label?.addEventListener('click', (e) => {
      if (e.target.closest('.help-icon')) return;
      e.preventDefault();
      if (!trigger.disabled) trigger.focus();
    });

    // ── Keep in sync with programmatic changes ──────────────────────────────
    select.addEventListener('change', sync);
    select.addEventListener('input', sync);

    // `select.value = ...` does not fire events; intercept the setter.
    Object.defineProperty(select, 'value', {
      configurable: true,
      get() {
        return valueDescriptor.get.call(this);
      },
      set(v) {
        valueDescriptor.set.call(this, v);
        sync();
      },
    });

    // `disabled` and the validation classes are toggled by other scripts.
    new MutationObserver(sync).observe(select, {
      attributes: true,
      attributeFilter: ['disabled', 'class'],
    });

    // Form reset restores defaults without firing change events.
    select.form?.addEventListener('reset', () => setTimeout(sync, 0));

    sync();
  }

  // Close the open dropdown on outside click, scroll-less resize, or tab switch.
  document.addEventListener('mousedown', (e) => {
    if (openInstance && !e.target.closest('.cs')) openInstance.close();
  });
  window.addEventListener('resize', () => openInstance?.close());
  document.addEventListener('hide.bs.tab', () => openInstance?.close());

  document
    .querySelectorAll('select.form-select')
    .forEach((select) => enhance(select));
})();
