/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

/* beautify preserve:start */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
/* beautify preserve:end */

import "oe-i18n-msg/oe-i18n-msg.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-button/paper-button.js";

/**
 * # oe-message-handler
 * `<oe-message-handler>` is an element for handling message/warning/error display using `<paper-toast>`.
 * The component can be placed anywhere on the main application page and all message display will be 
 * handled automatically.
 * 
 * ```
 *  <oe-message-handler duration="2000" persist-on="error"></oe-message-handler>
 * ```
 * 
 * ## Show a toast
 * 
 * ### Within a polymer element
 * ```
 * this.fire('oe-show-message','Hello World!');
 * ```
 * 
 * ### From javascript
 * ```
 *  var event = new CustomEvent('oe-show-message', {detail: "Hello World!"});
 *  window.dispatchEvent(event);
 * ```
 * 
 * ## For warning and error messages
 * ```
 *  this.fire('oe-show-warning','This is a warning message!');
 *  this.fire('oe-show-error','Oh snap! something went terribly wrong');
 * ```
 * 
 * ## Toast that stays forever
 * ``` 
 *  this.fire('oe-show-message',{
 *      message:'This message stays until the next toast',
 *      forever:true
 *  });
 * ```
 * 
 * ## Toasts to be explicitly dismissed
 *   When persist-on="error,warning" is provided, all error and warning messages will persist and 
 * OK button must be pressed to dismiss the toast. An ok callback can be provided which is invoked 
 * when user presses OK.
 * ```
 *  this.fire('oe-show-error', {
 *        message:'You must login before posting data.',
 *      ok: goToLoginPage
 *  });
 * ```
 * 
 * 
 * ## i18n
 * If passed in message object has a `code` property, it is transformed for i18n. This means, you can pass the error-codes/message-codes as `msgData.code` and `oe-message-handler` will translate them into current language. When a translation is not found, `msgData.message` is displayed (if present), otherwise `msgData.code` (i.e. the error-code/message-code) is displayed as it is.
 * ``` 
 * this.fire('oe-show-error', {
 *         code:'invalid-credentials',
 *         message: 'Invalid Credentials'
 * });
 * ```
 * 
 * Now the `oe-message-handler` will look for a translation for 'invalid-credentials' and will display 
 * if it is found. If the translation is not defined then 'Invalid Credentials' will be displayed.
 * 
 * ## Confirmation window
 * 
 * Confirmation toast, takes ok and cancel callbacks.
 * ```
 *     this.fire('oe-show-confirm', {
 *       message:'Record will be permanently removed. Are you sure?',
 *       ok: okCallback,
 *       cancel:cancelCallback
 *     });
 * ```
 * ## Styling
 * The following custom properties and mixins are available for styling:
 * 
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--oe-message-success-background` | The background color of the success | `#78ab46`
 * `--oe-message-warning-background` | The background color of the warning | `#ffa000`
 * `--oe-message-error-background`   | The background color of the error   | `#d32f2f`
 * 
 * @customElement
 * @polymer
 * @demo demo/demo-oe-message-handler.html
 */
class OeMessageHandler extends mixinBehaviors([], PolymerElement) {
  static get is() {
    return 'oe-message-handler';
  }

  static get template() {
    return html `
      <style>
        .success {
          background: var(--oe-message-success-background, #78ab46);
        }

        .warning {
          background: var(--oe-message-warning-background, #ffa000);
        }

        .error {
          background: var(--oe-message-error-background, #d32f2f);
        }

        paper-toast {
          @apply(--oe-message-handler-toast-mixin);
        }

      </style>
      <oe-i18n-msg id="translator"></oe-i18n-msg>
      <paper-toast id="toast">
      </paper-toast>

      <paper-toast duration=0 id="closable">
        <paper-button id="closableOK" on-tap="_closeToast">
          <oe-i18n-msg msgid=[[okLabel]]>[[okLabel]]</oe-i18n-msg>
        </paper-button>
      </paper-toast>

      <paper-toast with-backdrop id="confirm">
        <paper-button id="cancel" on-tap="_choiceMade">
          <oe-i18n-msg msgid=[[cancelLabel]]>[[cancelLabel]]</oe-i18n-msg>
        </paper-button>
        <paper-button id="ok" on-tap="_choiceMade">
          <oe-i18n-msg msgid=[[okLabel]]>[[okLabel]]</oe-i18n-msg>
        </paper-button>
      </paper-toast>
      `;
  }

  static get properties() {
    return {
      /* duration for the toast display */
      duration: {
        type: Number,
        value: 3000
      },

      /* fit entire screen width at bottom */
      fitBottom: {
        type: Boolean
      },

      /* comma separated list of messaging events when the toast should persist and
       * should not auto hide after `duration`
       */
      persistOn: {
        type: String
      }
    };
  }

  showToast(type, data) {
    var toast = this.$.toast;
    var msgCode = data.code || data.message || data;
    //use data.message also, in case somebody is still passing only message as messageCode and expecting translation

    var placeholders = data.placeholders;
    var translatedMsg = this.$.translator.getInterpolatedMsg(msgCode, placeholders) || data.message || msgCode;

    var duration = data.forever ? 0 : this.duration;

    this.set('okLabel', data.okLabel || 'OK');
    this.set('cancelLabel', data.cancelLabel || 'Cancel');
    if (type === 'confirm') {
      toast = this.$.confirm;
    } else if (typeof data.ok === 'function' || (this.persistOn && this.persistOn.indexOf(type) >= 0)) {
      toast = this.$.closable;
      this.$.closableOK.cb = data.ok;
      duration = 0;
    }

    toast.hide();
    toast.set('duration', duration);
    toast.set('text', translatedMsg);
    toast.classList.remove('success');
    toast.classList.remove('warning');
    toast.classList.remove('error');
    toast.classList.remove('message');
    toast.classList.add(type);
    toast.show();
  }

  showConfirmation(data) {
    if(typeof data === 'string'){
      data = {message: data};
    }
    data.forever = true;

    this.$.ok.cb = data.ok;
    this.$.cancel.cb = data.cancel;

    this.showToast('confirm', data);

    //paper-toast has overriden [_renderOpen] method of IronOverlayBehavior
    //so backdrop never closes.
    //Execute the IronOverlayBehavior._renderOpen steps explicitly
    // if (this.$.confirm.withBackdrop) {
    //   this.$.confirm.backdropElement.open();
    // }
    // this.$.confirm._finishRenderOpened();

  }

  _choiceMade(e) {
    if (e.currentTarget.cb) {
      e.currentTarget.cb();
    }

    this.set('okLabel', 'OK');
    this.set('cancelLabel', 'Cancel');
    this.$.ok.cb = undefined;
    this.$.cancel.cb = undefined;
    this.$.confirm.close();

    //paper-toast has overriden [_renderClose] method of IronOverlayBehavior
    //so backdrop never closes.
    //Execute the IronOverlayBehavior._renderClose steps explicitly
    // if (this.$.confirm.withBackdrop) {
    //   this.$.confirm.backdropElement.close();
    // }
    // this.$.confirm._finishRenderClosed();
  }

  _closeToast(e) {
    this.set('okLabel', 'OK');
    this.set('cancelLabel', 'Cancel');

    this.$.closable.toggle();
    if (typeof e.currentTarget.cb === "function") {
      e.currentTarget.cb();
      e.currentTarget.cb = undefined;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.fitBottom) {
      this.$.toast.classList.add('fit-bottom');
      this.$.closable.classList.add('fit-bottom');
      this.$.confirm.classList.add('fit-bottom');
    }
  }

  ready() {
    super.ready();
    var self = this;
    window.addEventListener('oe-show-success', function(e) {
      self.showToast('success', e.detail);
    });
    window.addEventListener('oe-show-message', function(e) {
      self.showToast(e.detail.type || 'message', e.detail);
    });
    window.addEventListener('oe-show-error', function(e) {
      self.showToast('error', e.detail);
    });
    window.addEventListener('oe-show-warning', function(e) {
      self.showToast('warning', e.detail);
    });
    window.addEventListener('oe-show-confirm', function(e) {
      self.showConfirmation(e.detail);
    });
  }
}

window.customElements.define(OeMessageHandler.is, OeMessageHandler);
