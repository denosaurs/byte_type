;; Copyright 2023 the Blocktopus authors. All rights reserved. MIT license.
;; This file is here as a reference as to what the embedded wasm binary is
(module
  (memory (export "mem") 1)
  (func $read_var_long
    (export "readVarLong")
    (param $ptr i32)
    (result i64 i32)
    (local $v i64)
    (local $length i64)
    (local $temp i64)

    (block $B0
      (loop $L0
        ;; CurrentByte
        local.get $ptr
        i64.load8_u
        local.tee $temp
        i64.const 127
        i64.and

        ;; << 7 * length
        local.get $length
        i64.shl
        ;; value |= i64.shl
        local.get $v
        i64.or
        local.set $v

        ;; length++;
        local.get $length
        i64.const 7
        i64.add
        local.tee $length

        ;; CurrentByte
        local.get $temp
        i64.const 128
        i64.and
        i64.eqz
        br_if $B0

        ;; Move to next iteration
        local.get $ptr
        i32.const 1
        i32.add
        local.set $ptr

        ;; Branch if not over 70
        i64.const 70
        i64.lt_u
        br_if $L0
      )
      unreachable
    )

    local.get $v
    local.get $length
    i64.const 7
    i64.div_u
    i32.wrap_i64
  )

  (func $write_var_long
    (export "writeVarLong")
    (param $value i64)
    (result i32)
    (local $length i32)

    (block $B0
      (loop $L0
        local.get $value
        i64.const -128
        i64.and
        i64.eqz
        br_if $B0

        local.get $length

        local.get $value
        i64.const 127
        i64.and
        i64.const 128
        i64.or
        i64.store8

        local.get $value
        i64.const 7
        i64.shr_u
        local.set $value

        local.get $length
        i32.const 1
        i32.add
        local.set $length

        br $L0
      )
    )
    local.get $length
    local.get $value
    i64.store8

    i32.const 1
    local.get $length
    i32.add
  )
)