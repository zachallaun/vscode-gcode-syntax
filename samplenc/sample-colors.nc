%
O01234
G40 G49 G80
( BEGIN TOOL LIST )
( TOOL 17 - 3/8 EM - DESC: 0.3771 DIA, 2 FLUTE,  CARBIDE MAT )
( ENDOF TOOL LIST )

( WORK ZERO )
G54

(POCKET SLOTS)
(Tool Diameter = 0.3771 Length = 1.5 )
G20 T17 M6
T808

T0202

M08
S12000 M03

T#123

H#123

H27.4

S3200 M04
G90 G0 X-1.9996 Y-6.2902
G43 Z-2.8833 H17
G1 Z-3.1333 F45.
X-2.0486 Y-6.2744 Z-3.1378 F67.5
X-2.1029 Y-6.2565 Z-3.1428
X-2.157 Y-6.238 Z-3.1478
X-2.2109 Y-6.2191 Z-3.1528
X-2.2647 Y-6.1997 Z-3.1578
G02 X5. Y6. R2.0
G03 X5. Y6. R3.5

G04 P50.

G154 P25

G54.1 P35   

G05.1

G68.2

G53.1

G59 P25

G112

G15 H10

X.1234

X-.1242

M04 S5000

(POCKET SLOTS)
(Tool Diameter = 0.3771 Length = 1.5 )
M06 T12
M08
S12000 M03

S5000 M03
M3 S#1243

M3 S[1234 / #123]

G41 D02

#3004=0
#28=0(LOOP CHECKING)
WHILE[ABS[#5+7.]]LT0.1]D02(WAIT FOR OPCODE)
G02X#[#31+10.]
#28=#28+1
IF[#28 LT 5000] GOTO300
#33=78
N300
END2
E.#234
E#234

F[#123/2]

X[#234 / 2]

G04 P1.
G04 P.5
G04 P500

IF[#898EQ#996]GOTO19999

#[#8 + 7.]=0

G51 P[ #5 * 1000 ]

#101 = FIX[ #1 MOD 1000 ]

G65 P5000 A1. B2. C3.

M09

(POCKET SLOTS)
(Tool Diameter = 0.3771 Length = 1.5 )
G20 T1 M06
M08
S12000 M03

M97 P1000

T13 M6

M30 


N1000
( LOCAL SUB PROGRAM)

G00 X0. Y0.

M6 T25

M99




%
