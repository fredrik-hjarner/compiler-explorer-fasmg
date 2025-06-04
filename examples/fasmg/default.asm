; Can include everything in fasm2's "include" folder
include "xcalm.inc"

; see data in Editor window
db "some data"

; See output in Output window
calminstruction test
    asm display "Hello world!"
end calminstruction
test
