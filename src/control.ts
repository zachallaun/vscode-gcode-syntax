/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { commands, Disposable, ExtensionContext } from 'vscode';
import { Config, configuration } from './util/configuration/config';
import { Logger } from './util/logger';
import { StatusBarControl } from './util/statusBar';
import { NavTreeView } from './views/navTreeView';
import { GCodeUnitsController } from './gcodeUnits';
import { StatsView } from './views/statsView';
import { constants, Contexts, PIcon, VSBuiltInCommands } from './util/constants';
import { UtilCommands } from './util/commands/common';
import { Version } from './util/version';
import { Messages } from './util/messages';
import { StateControl } from './util/stateControl';
import { CodesWebview } from './webviews/codesWebview';
import { MachineTypeControl } from './util/machineType';
import { GCodeHoverControl } from './hovers/gcodeHoverControl';
import { defaults } from './util/configuration/defaults';

const cfgUnits = 'general.units';
const cfgAutoRef = {
    navTree: 'views.navTree.autoRefresh',
    stats: 'views.stats.autoRefresh',
};

export class Control {
    private static _config: Config | undefined;
    private static _context: ExtensionContext;
    private static _units: string | undefined;

    // Controllers
    private static _machineTypeControl: MachineTypeControl | undefined;
    private static _statusBarControl: StatusBarControl;
    private static _unitsController: GCodeUnitsController | undefined;
    private static _stateController: StateControl;
    private static _hoverController: GCodeHoverControl;

    // Views
    private static _statsView: StatsView | undefined;
    private static _navTree: NavTreeView | undefined;

    // Webviews
    private static _codesWebview: CodesWebview | undefined;

    private static async checkVersion() {
        const gcodeVersion = new Version(constants.extension.version);

        const prevVer = this._stateController.getVersion();

        const newVer = gcodeVersion.compareWith(prevVer.getVersion()) === 1 ? true : false;

        if (newVer) {
            // Extension has been updated

            // Update globalState version
            Logger.log('Updating...');
            void this._stateController.updateVer(gcodeVersion);

            Logger.log(`G-Code upgraded from ${prevVer.getVersionAsString()} to ${gcodeVersion.getVersionAsString()}`);
            await this.showWhatsNew(gcodeVersion);
        } else {
            return;
        }
    }

    private static async showWhatsNew(ver: Version) {
        // Show Whats New Message
        await Messages.showWhatsNewMessage(ver);
    }

    // Static Methods
    static initialize(context: ExtensionContext, config: Config) {
        this._context = context;
        this._config = config;

        // Load StatusBars
        context.subscriptions.push((this._statusBarControl = new StatusBarControl()));

        // Load Machine Type
        context.subscriptions.push((this._machineTypeControl = new MachineTypeControl()));

        // Load State Controller
        this._stateController = new StateControl(context);

        // Load Hover Controller
        context.subscriptions.push((this._hoverController = new GCodeHoverControl()));

        // Units
        this._units = config.getParam(cfgUnits) ?? defaults.general.units;
        Logger.log(`Units: ${this._units}`);
        if (this._units === 'Auto') {
            // Load Units Monitor
            context.subscriptions.push((this._unitsController = new GCodeUnitsController()));
        } else {
            let disposable: Disposable;
            // eslint-disable-next-line prefer-const
            disposable = configuration.onDidChange(e => {
                if (configuration.changed(e, cfgUnits)) {
                    this._units = <string>configuration.getParam(cfgUnits);
                    if (this._units === 'Auto') {
                        disposable.dispose();
                        Logger.log(`Units: ${this._units}`);
                        context.subscriptions.push((this._unitsController = new GCodeUnitsController()));
                    } else {
                        return;
                    }
                }
            });

            this._statusBarControl.updateStatusBar(this._units, 'unitsBar');
        }

        // Load Nav Tree
        Logger.log('Loading Nav Tree...');

        context.subscriptions.push((this._navTree = new NavTreeView()));

        Logger.log(
            `Nav Tree AutoRefresh: ${configuration.getParam<boolean>(cfgAutoRef.navTree) ? 'Enabled' : 'Disabled'}`,
        );

        // Load Stats View
        Logger.log('Loading Stats View...');
        context.subscriptions.push((this._statsView = new StatsView()));

        Logger.log(`Stats AutoRefresh: ${configuration.getParam<boolean>(cfgAutoRef.stats) ? 'Enabled' : 'Disabled'}`);

        // Load Support Heart to Statusbar
        this._statusBarControl.updateStatusBar(
            PIcon.Heart,
            'support',
            'Support G-Code Syntax ❤',
            undefined,
            UtilCommands.ShowSupportGCode,
        );

        // Check Version
        void this.checkVersion();

        // Set Up Webviews
        context.subscriptions.push((this._codesWebview = new CodesWebview()));
    }

    static terminate() {
        Logger.log('Terminating Extension...');

        // Dispose Views
        this._codesWebview?.dispose();
        this._statsView?.dispose();
        this._statsView?.dispose();

        // Dispose Controllers
        this._hoverController.dispose();
        this._unitsController?.dispose();
        this._machineTypeControl?.dispose();
        this._statusBarControl?.dispose();
    }

    static getLoadTime(start: [number, number]): number {
        const [secs, nanosecs] = process.hrtime(start);
        return secs * 1000 + nanosecs / 1000000;
    }

    static setContext(key: Contexts | string, value: any) {
        return commands.executeCommand(VSBuiltInCommands.SetContext, key, value);
    }

    static get context() {
        return this._context;
    }

    static get config() {
        return this._config;
    }

    static get machineType() {
        return this._machineTypeControl;
    }

    static get navTree() {
        if (this._navTree === undefined) {
            this._context.subscriptions.push((this._navTree = new NavTreeView()));
        }

        return this._navTree;
    }

    static get statsView() {
        if (this._statsView === undefined) {
            this._context.subscriptions.push((this._statsView = new StatsView()));
        }

        return this._statsView;
    }

    static get statusBarController() {
        return this._statusBarControl;
    }

    static get gcodeUnitsController() {
        return this._unitsController;
    }

    static get stateController() {
        return this._stateController;
    }
}
