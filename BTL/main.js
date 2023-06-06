// accumulate values to put into text area
var accumulated_output_info;

// add a labeled value to the text area
function accumulate_output( str )
{
   accumulated_output_info = accumulated_output_info + str + "\n";
}

// add a bit string to the output, inserting spaces as designated
function accumulate_bitstring( label, ary, spacing )
{
   var i;

   accumulated_output_info += label;

   // add bits
   for( i=1; i<ary.length; i++ )
   {
      if ( (i%spacing) == 1 )
         accumulated_output_info += " ";	// time to add a space
      accumulated_output_info += ary[i];	// and the bit
   }

   // insert trailing end-of-line
   accumulated_output_info += "\n";
}

// special value stored in x[0] to indicate a problem
var ERROR_VAL = -9876;

// initial permutation (split into left/right halves )
// since DES numbers bits starting at 1, we will ignore x[0]
var IP_perm = new Array( -1,
	58, 50, 42, 34, 26, 18, 10, 2,
	60, 52, 44, 36, 28, 20, 12, 4,
	62, 54, 46, 38, 30, 22, 14, 6,
	64, 56, 48, 40, 32, 24, 16, 8,
	57, 49, 41, 33, 25, 17, 9, 1,
	59, 51, 43, 35, 27, 19, 11, 3,
	61, 53, 45, 37, 29, 21, 13, 5,
	63, 55, 47, 39, 31, 23, 15, 7 );

// final permutation (inverse initial permutation)
var FP_perm = new Array( -1,
	40, 8, 48, 16, 56, 24, 64, 32,
	39, 7, 47, 15, 55, 23, 63, 31,
	38, 6, 46, 14, 54, 22, 62, 30,
	37, 5, 45, 13, 53, 21, 61, 29,
	36, 4, 44, 12, 52, 20, 60, 28,
	35, 3, 43, 11, 51, 19, 59, 27,
	34, 2, 42, 10, 50, 18, 58, 26,
	33, 1, 41, 9, 49, 17, 57, 25 );

// per-round expansion
var E_perm = new Array( -1,
	32, 1, 2, 3, 4, 5,
	4, 5, 6, 7, 8, 9,
	8, 9, 10, 11, 12, 13,
	12, 13, 14, 15, 16, 17,
	16, 17, 18, 19, 20, 21,
	20, 21, 22, 23, 24, 25,
	24, 25, 26, 27, 28, 29,
	28, 29, 30, 31, 32, 1 );

// per-round permutation
var P_perm = new Array( -1,
	16, 7, 20, 21, 29, 12, 28, 17,
	1, 15, 23, 26, 5, 18, 31, 10,
	2, 8, 24, 14, 32, 27, 3, 9,
	19, 13, 30, 6, 22, 11, 4, 25 );

// note we do use element 0 in the S-Boxes
var S1 = new Array(
	14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7,
	0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8,
	4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0,
	15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13 );
var S2 = new Array(
	15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10,
	3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5,
	0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15,
	13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9 );
var S3 = new Array(
	10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8,
	13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1,
	13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7,
	1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12 );
var S4 = new Array(
	7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15,
	13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9,
	10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4,
	3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14 );
var S5 = new Array(
	2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9,
	14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6,
	4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14,
	11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3 );
var S6 = new Array(
	12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11,
	10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8,
	9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6,
	4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13 );
var S7 = new Array(
	4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1,
	13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6,
	1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2,
	6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12 );
var S8 = new Array(
	13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7,
	1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2,
	7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8,
	2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11 );

//, first, key, permutation
var PC_1_perm = new Array( -1, 
	// C subkey bits
	57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18,
	10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36,
	// D subkey bits
	63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22,
	14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4 );

//, per-round, key, selection, permutation
var PC_2_perm = new Array( -1, 
	14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10,
	23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2,
	41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48,
	44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32 );

// save output in case we want to reformat it later
var DES_output = new Array( 65 );

// remove spaces from input
function remove_spaces( instr )
{
   var i;
   var outstr="";

   for( i=0; i<instr.length; i++ )
      if ( instr.charAt(i) != " " )
         // not a space, include it
         outstr += instr.charAt(i);

   return outstr;
}

// split an integer into bits
// ary   = array to store bits in
// start = starting subscript
// bitc  = number of bits to convert
// val   = number to convert
function split_int( ary, start, bitc, val )
{
   var i = start;
   var j;
   for( j=bitc-1; j>=0; j-- )
   {
      // isolate low-order bit
      ary[i+j] = val & 1;
      // remove that bit
      val >>= 1;
   }
}

// get the message to encrypt/decrypt
function get_value( bitarray, str, isASCII )
{
   var i;
   var val;	// one hex digit

   // insert note we probably are ok
   bitarray[0] = -1;

   if ( isASCII )
   {
      // check length of data
      if ( str.length != 8 )
      {
         window.alert("Message and key must be 64 bits (8 ASCII characters)");
         bitarray[0] = ERROR_VAL;
         return
      }

      // have ASCII data
      for( i=0; i<8; i++ )
      {
         split_int( bitarray, i*8+1, 8, str.charCodeAt(i) );
      }
   }
   else
   {
      // have hex data - remove any spaces they used, then convert
      str = remove_spaces(str);

      // check length of data
      if ( str.length != 16 )
      {
         window.alert("Message and key must be 64 bits (16 hex digits)");
         bitarray[0] = ERROR_VAL;
         return;
      }

      for( i=0; i<16; i++ )
      {
         // get the next hex digit
         val = str.charCodeAt(i);

         // do some error checking
         if ( val >= 48 && val <= 57 )
            // have a valid digit 0-9
            val -= 48;
         else if ( val >= 65 && val <= 70 )
            // have a valid digit A-F
            val -= 55;
         else if ( val >= 97 && val <= 102 )
            // have a valid digit A-F
            val -= 87;
         else
         {
            // not 0-9 or A-F, complain
            window.alert( str.charAt(i)+" is not a valid hex digit" );
            bitarray[0] = ERROR_VAL;
            return;
         }

         // add this digit to the array
         split_int( bitarray, i*4+1, 4, val-48 );
      }
   }
}

// format the output in the desired form
// if -1, use existing value
// -- uses the global array DES_output
function format_DES_output( )
{
   var i;
   var bits;
   var str="";

   // what type of data do we have to work with?
   if ( document.stuff.outtype[0].checked )
   {
      // convert each set of bits back to ASCII
      for( i=1; i<=64; i+= 8 )
      {
            str += String.fromCharCode(
                        DES_output[i  ]*128 + DES_output[i+1]*64  +
                        DES_output[i+2]*32  + DES_output[i+3]*16  +
                        DES_output[i+4]*8   + DES_output[i+5]*4   +
                        DES_output[i+6]*2   + DES_output[i+7] );
      }
   }
   else 
   {
      // output hexdecimal data
      for( i=1; i<=64; i+= 4 )
      {
            bits = DES_output[i  ]*8   + DES_output[i+1]*4   +
                   DES_output[i+2]*2   + DES_output[i+3];

            // 0-9 or A-F?
            if ( bits <= 9 )
               str += String.fromCharCode( bits+48 );
            else
               str += String.fromCharCode( bits+87 );
      }
   }

   // copy to textbox
   document.stuff.outdata.value = str;
}

// copy bits in a permutation
//   dest = where to copy the bits to
//   src  = Where to copy the bits from
//   perm = The order to copy/permute the bits
// note: since DES ingores x[0], we do also
function permute( dest, src, perm )
{
  var i;
  var fromloc;

  for( i=1; i<perm.length; i++ )
  {
    fromloc = perm[i];
    dest[i] = src[fromloc];
  }
}

// do an array XOR
// assume all array entries are 0 or 1
function xor( a1, a2 )
{
   var i;

   for( i=1; i<a1.length; i++ )
      a1[i] = a1[i] ^ a2[i];
}

// process one S-Box, return integer from S-Box
function do_S( SBox, index, inbits )
{
   // collect the 6 bits into a single integer
   var S_index = inbits[index  ]*32 + inbits[index+5]*16 +
                 inbits[index+1]*8  + inbits[index+2]*4 +
                 inbits[index+3]*2  + inbits[index+4];

   // do lookup
   return SBox[S_index];
}

// do one round of DES encryption
function des_round( L, R, KeyR )
{
   var E_result = new Array( 49 );
   var S_out = new Array( 33 );

   // copy the existing L bits, then set new L = old R
   var temp_L = new Array( 33 );
   for( i=0; i<33; i++ )
   {
      // copy exising L bits
      temp_L[i] = L[i];

      // set L = R
      L[i] = R[i];
   }

   // expand R using E permutation
   permute( E_result, R, E_perm );
   accumulate_bitstring( "E   : ", E_result, 6 );
   accumulate_bitstring( "KS  : ", KeyR, 6 );

   // exclusive-or with current key
   xor( E_result, KeyR );
   accumulate_bitstring( "E xor KS: ", E_result, 6 );

   // put through the S-Boxes
   split_int( S_out,  1, 4, do_S( S1,  1, E_result ) );
   split_int( S_out,  5, 4, do_S( S2,  7, E_result ) );
   split_int( S_out,  9, 4, do_S( S3, 13, E_result ) );
   split_int( S_out, 13, 4, do_S( S4, 19, E_result ) );
   split_int( S_out, 17, 4, do_S( S5, 25, E_result ) );
   split_int( S_out, 21, 4, do_S( S6, 31, E_result ) );
   split_int( S_out, 25, 4, do_S( S7, 37, E_result ) );
   split_int( S_out, 29, 4, do_S( S8, 43, E_result ) );
   accumulate_bitstring( "Sbox: ", S_out, 4 );

   // do the P permutation
   permute( R, S_out, P_perm );
   accumulate_bitstring( "P   :", R, 8 );

   // xor this with old L to get the new R
   xor( R, temp_L );
   accumulate_bitstring( "L[i]:", L, 8 );
   accumulate_bitstring( "R[i]:", R, 8 );
}

// shift the CD values left 1 bit
function shift_CD_1( CD )
{
   var i;

   // note we use [0] to hold the bit shifted around the end
   for( i=0; i<=55; i++ )
      CD[i] = CD[i+1];

   // shift D bit around end
   CD[56] = CD[28];
   // shift C bit around end
   CD[28] = CD[0];
}

// shift the CD values left 2 bits
function shift_CD_2( CD )
{
   var i;
   var C1 = CD[1];

   // note we use [0] to hold the bit shifted around the end
   for( i=0; i<=54; i++ )
      CD[i] = CD[i+2];

   // shift D bits around end
   CD[55] = CD[27];
   CD[56] = CD[28];
   // shift C bits around end
   CD[27] = C1;
   CD[28] = CD[0];
}


// do the actual DES encryption/decryption
function des_encrypt( inData, Key, do_encrypt )
{
   var tempData = new Array( 65 );	// output bits
   var CD = new Array( 57 );		// halves of current key
   var KS = new Array( 16 );		// per-round key schedules
   var L = new Array( 33 );		// left half of current data
   var R = new Array( 33 );		// right half of current data
   var result = new Array( 65 );	// DES output
   var i;

   // do the initial key permutation
   permute( CD, Key, PC_1_perm );
   accumulate_bitstring( "CD[0]: ", CD, 7 );

   // create the subkeys
   for( i=1; i<=16; i++ )
   {
      // create a new array for each round
      KS[i] = new Array( 49 );

      // how much should we shift C and D?
      if ( i==1 || i==2 || i==9 || i == 16 )
         shift_CD_1( CD );
      else
         shift_CD_2( CD );
      accumulate_bitstring( "CD["+i+"]: ", CD, 7 );

      // create the actual subkey
      permute( KS[i], CD, PC_2_perm );
      accumulate_bitstring( "KS["+i+"]: ", KS[i], 6 );
   }

   // handle the initial permutation
   permute( tempData, inData, IP_perm );

   // split data into L/R parts
   for( i=1; i<=32; i++ )
   {
      L[i] = tempData[i];
      R[i] = tempData[i+32];
   }
   accumulate_bitstring( "L[0]: ", L, 8 );
   accumulate_bitstring( "R[0]: ", R, 8 );

   // encrypting or decrypting?
   if ( do_encrypt )
   {
      // encrypting
      for( i=1; i<=16; i++ )
      {
         accumulate_output( "Round " + i );
         des_round( L, R, KS[i] );
      }
   }
   else
   {
      // decrypting
      for( i=16; i>=1; i-- )
      {
         accumulate_output( "Round " + (17-i) );
         des_round( L, R, KS[i] );
      }
   }

   // create the 64-bit preoutput block = R16/L16
   for( i=1; i<=32; i++ )
   {
      // copy R bits into left half of block, L bits into right half
      tempData[i] = R[i];
      tempData[i+32] = L[i];
   }
   accumulate_bitstring ("LR[16] ", tempData, 8 );

   // do final permutation and return result
   permute( result, tempData, FP_perm );
   return result;
}


// do encrytion/decryption
// do_encrypt is TRUE for encrypt, FALSE for decrypt
function do_des( do_encrypt )
{
   var inData = new Array( 65 );	// input message bits
   var Key = new Array( 65 );

   accumulated_output_info = "";

   // get the message from the user
   // also check if it is ASCII or hex
   get_value( inData, document.stuff.indata.value,
		document.stuff.intype[0].checked );

   // problems??
   if ( inData[0] == ERROR_VAL )
   {
      document.stuff.details.value = accumulated_output_info;
      return;
   }
   accumulate_bitstring( "Input bits:", inData, 8 );

   // get the key from the user
   get_value( Key, document.stuff.key.value, false );
   // problems??
   if ( Key[0] == ERROR_VAL )
   {
      document.stuff.details.value = accumulated_output_info;
      return;
   }
   accumulate_bitstring( "Key bits:", Key, 8 );

   // do the encryption/decryption, put output in DES_output for display
   DES_output = des_encrypt( inData, Key, do_encrypt )

   accumulate_bitstring ("Output ", DES_output, 8 );

   // process output
   format_DES_output( );
   document.stuff.details.value = accumulated_output_info;
}
function format_DES_output1( )
{
   var i;
   var bits;
   var str="";

   // what type of data do we have to work with?
   if ( document.stuff.outtype1[0].checked )
   {
      // convert each set of bits back to ASCII
      for( i=1; i<=64; i+= 8 )
      {
            str += String.fromCharCode(
                        DES_output[i  ]*128 + DES_output[i+1]*64  +
                        DES_output[i+2]*32  + DES_output[i+3]*16  +
                        DES_output[i+4]*8   + DES_output[i+5]*4   +
                        DES_output[i+6]*2   + DES_output[i+7] );
      }
   }
   else 
   {
      // output hexdecimal data
      for( i=1; i<=64; i+= 4 )
      {
            bits = DES_output[i  ]*8   + DES_output[i+1]*4   +
                   DES_output[i+2]*2   + DES_output[i+3];

            // 0-9 or A-F?
            if ( bits <= 9 )
               str += String.fromCharCode( bits+48 );
            else
               str += String.fromCharCode( bits+87 );
      }
   }

   // copy to textbox
   document.stuff.outdata1.value = str;
}
function des_encrypt1( inData1, Key, do_encrypt )
{
   var tempData = new Array( 65 );	// output bits
   var CD = new Array( 57 );		// halves of current key
   var KS = new Array( 16 );		// per-round key schedules
   var L = new Array( 33 );		// left half of current data
   var R = new Array( 33 );		// right half of current data
   var result = new Array( 65 );	// DES output
   var i;

   // do the initial key permutation
   permute( CD, Key, PC_1_perm );
   accumulate_bitstring( "CD[0]: ", CD, 7 );

   // create the subkeys
   for( i=1; i<=16; i++ )
   {
      // create a new array for each round
      KS[i] = new Array( 49 );

      // how much should we shift C and D?
      if ( i==1 || i==2 || i==9 || i == 16 )
         shift_CD_1( CD );
      else
         shift_CD_2( CD );
      accumulate_bitstring( "CD["+i+"]: ", CD, 7 );

      // create the actual subkey
      permute( KS[i], CD, PC_2_perm );
      accumulate_bitstring( "KS["+i+"]: ", KS[i], 6 );
   }

   // handle the initial permutation
   permute( tempData, inData1, IP_perm );

   // split data into L/R parts
   for( i=1; i<=32; i++ )
   {
      L[i] = tempData[i];
      R[i] = tempData[i+32];
   }
   accumulate_bitstring( "L[0]: ", L, 8 );
   accumulate_bitstring( "R[0]: ", R, 8 );

   // encrypting or decrypting?
   if ( do_encrypt )
   {
      // encrypting
      for( i=1; i<=16; i++ )
      {
         accumulate_output( "Round " + i );
         des_round( L, R, KS[i] );
      }
   }
   else
   {
      // decrypting
      for( i=16; i>=1; i-- )
      {
         accumulate_output( "Round " + (17-i) );
         des_round( L, R, KS[i] );
      }
   }

   // create the 64-bit preoutput block = R16/L16
   for( i=1; i<=32; i++ )
   {
      // copy R bits into left half of block, L bits into right half
      tempData[i] = R[i];
      tempData[i+32] = L[i];
   }
   accumulate_bitstring ("LR[16] ", tempData, 8 );

   // do final permutation and return result
   permute( result, tempData, FP_perm );
   return result;
}
// do encrytion/decryption
// do_encrypt is TRUE for encrypt, FALSE for decrypt
function do_des1( do_encrypt )
{
   var inData1 = new Array( 65 );	// input message bits
   var Key = new Array( 65 );

   accumulated_output_info = "";

   // get the message from the user
   // also check if it is ASCII or hex
   get_value( inData1, document.stuff.indata1.value,
		document.stuff.intype[0].checked );

   // problems??
   if ( inData1[0] == ERROR_VAL )
   {
      document.stuff.details1.value = accumulated_output_info;
      return;
   }
   accumulate_bitstring( "Input bits:", inData1, 8 );

   // get the key from the user
   get_value( Key, document.stuff.key.value, false );
   // problems??
   if ( Key[0] == ERROR_VAL )
   {
      document.stuff.details1.value = accumulated_output_info;
      return;
   }
   accumulate_bitstring( "Key bits:", Key, 8 );

   // do the encryption/decryption, put output in DES_output for display
   DES_output = des_encrypt1( inData1, Key, do_encrypt )

   accumulate_bitstring ("Output ", DES_output, 8 );

   // process output
   format_DES_output1( );
   document.stuff.details1.value = accumulated_output_info;
}
function move(){
   var code = document.stuff.outdata.value;
   document.stuff.outdata.value = document.stuff.indata1.value;
   document.stuff.indata1.value = code;
}