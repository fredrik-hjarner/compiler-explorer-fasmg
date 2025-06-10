import type {PreliminaryCompilerInfo} from '../../types/compiler.interfaces.js';
import {BaseCompiler} from '../base-compiler.js';
import type {CompilationEnvironment} from '../compilation-env.js';

export class FasmgCompiler extends BaseCompiler {
    private readonly includePath: string | undefined;

    static get key() {
        return 'fasmg';
    }

    constructor(compilerInfo: PreliminaryCompilerInfo, env: CompilationEnvironment) {
        super(compilerInfo, env);
        this.includePath = this.compilerProps<string | undefined>(`compiler.${this.compiler.id}.includePath`);

        // "supports" settings
        this.compiler.supportsAsmDocs = false;
        this.compiler.supportsDeviceAsmView = false;
        this.compiler.supportsDemangle = false;
        this.compiler.supportsVerboseDemangling = false;
        this.compiler.supportsBinary = false;
        this.compiler.supportsExecute = false;
        this.compiler.supportsGccDump = false;
        this.compiler.supportsFiltersInBinary = false;
        this.compiler.supportsOptOutput = false;
        this.compiler.supportsVerboseAsm = false;
        this.compiler.supportsStackUsageOutput = false;
        this.compiler.supportsPpView = false;
        this.compiler.supportsAstView = false;
        this.compiler.supportsIrView = false;
        this.compiler.supportsClangirView = false;
        this.compiler.supportsRustMirView = false;
        this.compiler.supportsRustMacroExpView = false;
        this.compiler.supportsRustHirView = false;
        this.compiler.supportsHaskellCoreView = false;
        this.compiler.supportsHaskellStgView = false;
        this.compiler.supportsHaskellCmmView = false;
        this.compiler.supportsCfg = false;
        this.compiler.supportsGnatDebugViews = false;
        this.compiler.supportsLibraryCodeFilter = false;
        this.compiler.supportsMarch = false;
        this.compiler.supportsTarget = false;
        this.compiler.supportsTargetIs = false;
        this.compiler.supportsHyphenTarget = false;
    }

    override optionsForFilter(filters, outputFilename) {
        return [];
    }

    override prepareArguments(userOptions, filters, backendOptions, inputFilename, outputFilename) {
        // fasmg syntax: fasmg source [output]
        return [inputFilename, outputFilename];
    }

    override getDefaultExecOptions() {
        const execOptions = super.getDefaultExecOptions();

        // Set INCLUDE environment variable to find include files if configured
        if (this.includePath) {
            execOptions.env = {
                ...execOptions.env,
                INCLUDE: this.includePath,
            };
        } else {
            // error
            throw new Error('includePath is not set');
        }

        return execOptions;
    }
}
