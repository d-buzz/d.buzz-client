import React from 'react'

const HiveAuthenticationServiceIcon = ({ height = 20, style}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={height} style={style} viewBox="0 0 80 80" enable-background="new 0 0 80 80" >
                <image id="image0" width="80" height="80" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAWwUlEQVR42uWceZwT9dnAv88z2XsBdVOOFWJbxWo98Uy1HlW0HsVbxLOKUlDAE++qSN9WQe5TkUNUREXUepR6HxVdBa0ovpYKHpEF0XgLbOZ8/5iZbJJNsgtmxbd9Pp98MjM7+f1+893nnkzgRyhjxs1m7NQ5WcfGTrhjcy/rxy+jx85i9LjZ6f0x42bXjxk/e5twf8Lku5g4+a7Nvcwskc29AIBbxs4C4PJL+wMwasysckNlACLXiFCuomNEZfJFQ878DmDKtHtQFc4feOrmXvrmBThqzEwEuPyyc9PHRo+b9VuQ4SISVxFEQFQRkbdVZPiQC05/MDz3ttvvQ1UYcG7f/z6Ao8bMRFUZdsk5ANwydtaOAjeKyMkigoggGryLoM3H/qYiNwz6Q78l4Vgz71jAuWef+N8FMANkVxEZIjBURDpmQssBl7nfJCq3quiY8/qftApg1h0LiEQMzjrjuP8egKPGzNxCRB4QkUNFaAs4RMNtRVQaVWSUiEw/+6zjmwDmznsUEeG0fr/7zwcIMHrsrJ+J6uUi9FeRChEN/F4OOBFUA3Dp7fTxxap64xmnHfN4OO79Dyyk70lH/ucCvGXsrHTUBRg3cU5cRa4X1SPzg8vVwMzjiqqgKgtEdHi/vkctA5i/4HEMo5wTjjvs/x/AUWNmckUQXTO3c2XshDu49KKzAZh26zy1Xaeviv5RVHbKb7rhdrYmNr/rtyIyTVVHn3j84Z8BPPLoM4gKfY4+5McNcOToGQBcOey8Fn8bM242opKGlSkTJt2JqjJ08BkATL1tXicRGawil4pKXTFwATQfbghZBVV9X0VuUo85fY7tbQEsfOJFDFUOP+zXPz6AI0fPQFEuHxYmwzP3E+QCER4bdmn/e8Pzxk+8E1HhoiFnthhj8rS5VFSUM6D/yQBMn3H/tqpyrYieqSqRliacq4Ut91VlkYped9SRBz0XzvP0sy/T+5D9fhwAR94yAxSuvOy8
                EGRMRK4C+otIRXCxj4vIDZdc9PvXAUaOnU1NZTlDLji9xXi3Tr8XUWHgeaekj82e8+BBIjJCVQ7MApWlddpyv3nbUZW5huhfevfefznAM08voqyynAN/vffmAXjzLbcDwlWXnxfu14jIHwQZJkJ9biIs
                IutFZIaIjLxw8Bmrwde4iGEw6A/9Wow/Y9Z8VJX+QYJ89z2PGJ7nnaWqV4tIT80DroU5Z0FVVOULUR1viEw66KB9vwJY9PLrGIYS37fXDwfwplG3I9IMb+QtM/ogDBeRPUQEIbyg7Nwu0JpVonKzwMwLBp3WBDB9xn2IKAPOPTnvfHfe/XA6QZ5372NRUblEVQeLSKf85qsYmuEzA9jpcwxdriL/Y6fMew4+ZD8XYPGSt1GFPffY5YfRwEDrdgEZKcKRuaAy4Wnu3/wLWiwiNw4ccEo6d5s150H6//6EvHPNnfcoaiin9j0agPkL/v5LVbleRfuKimRqo2rhbRVFjLRGPqWqw/fZe7eXw3neeutddt11xx8K4IxeIowXCXxTAYAF61r/ou4T0b+ce86JbwHcMechNKKcdfqxeee8b/7fOOXko9L7Dz/y9BEByF9pMa1T/5ihmXmjoiqWiM42DPnz7rvtlAB4553lqGGw4w7btQ/ATP838bZ7JLWu6RQR+aOKn7tlQSwALiuvE/lWVaeIyNjfn3ncZ6HGnX5qn7zzL3joSVSF44/1E+TH/vZcpYicq6pXqkqPbG0MzTatdZmJdxq2ofqJqo4Tlak7/XL77wDeW/EBPbf7Wfto4MjRM1DVdDUxdsIdHQW5UFQuFpG6EGC6bk2DowBIRVXeF5GbQOaccVofC+D++QtRFU468YgWa3jksWeIGBGOOvIgAP7+1D+6GiLDVPV8UalOwwk1UrM1MnPfMMKAo0tVdcQvtv95um320UerMAyle/f6tgFMROPEkg1Z+0DWsVBGj5tNWZnBRUPOAmDC5Lu2FZFrVeRMESJpeFpUA3Nr25dU9LpT+h71fDjPgw8/iapy3DG9W6xh4d9foK5+K/bZ1Q8Azz7/Si8VHa6qx4SalmW2mWmOZh8PTV1VHzNUh//0pz1eB2hsXMPWW3druwYmonED2DqWbEi0BhFg/MQ5RMrLGTLI7xJPmXbPwSJyo6gcmBtEcmDl2VZUxRWRuaoy4sTjf7sCYMGDT1BRUc7vjv5Ni/mfenoRqsKhGQnyS4uWHKsqw1V19wJm2xxkmlOdDH+pG1R1/NZbd7tGJD+qYgDLgYXAcuBPsWTDmtZATpx8F6qaTpBvu+3+iKfe71XkGhH5eRFYLY5n5G+fi8p4FZl0TJ9DvwZ4fOHzGIbBEYcf0GINz73QQMQwOCBIkBtefbNW
                lUEqepmodi1gti20sNln6ueqGuvatfP6jQUYARqAPYEEMAqYGUs2NIUgC2njtNvmISLpBPn2mfOjqnKpiAwWlY6a4RNzgeUtyfy//UtVb3Qc5/5jfneoC/D0M4vofej+edfw8itvoCrpBPn1N5b9TFWu
                VNWzVaVCc7QuUwsNDVIdH2ijqvTs3Lnzhk0BuAjYJ+Pwa8DwWLJhYcZ5BUFOn3E/ZeVlnHPW8QDMvvPBnVTkehHtm9a6fLVtbmMgIy0RlSdU9E+HH/brReE8z7/4KgcfuG/eNSx5/S322nPX9P7by/71
                K1UdrqqHF/B9adMOjjWqSs9oXXSTAL4M5BaLHvAAMCKWbFgWQoTC/nHWHQvSJRnA3XMfOUJUblCVuA8sC1ARmOmEOCWqs1Rk1G8Ojn8I8NKiJYgI+++3Z941LH3rXXYLEuSV/16ptscpauh1qrpjHrPN
                DDCNqtpzyy23LBnAUL4DJgHjYsmGz1oDOefuhxFIl2T33vdYJaL9VeUqEenRbK6ao325jYJmn6kqa1V1rIpM2X//vdYBvLZ4KQD77L1bizX87//+G1VlhyBBXrHyw1rD0CmqepYhPsA8AaVRRHpuscUW
                JQcYyvvAX4A5sWSD3RrIe+Y9ihoG/fr61cT8BX+vV5UrVHSAqFTnbU/llGR5qo03VWVEfN9eDwG8/sbbRWva91Z8QE2HGuq7dCbxceMgEZlm5ElrgsjbCLSLBubK8/jR+tnWIIJ/z6KqqiLdJX74kaf2
                UNEbROWYlloYOvqchmpmjevnek8Yhg7bo9fOy9q4Zhob1wwRlUlpM9ZmDQ9PKQZQ2zpRG+Rg4MlEND47EY1vF0s2EEs2kIjG0zAzpe9JR2KmLB7661MAHHfMYW8c0+fQY1X0JFFZ2qwNGVEyp6LQrG1F
                VXRjr0lVxFD1U5qW8FqVUmpgpnwOTAAmxpINXwfjAfk18q+PPoOq0idIkJ944h81onK+qlwuqp2zbiJlaV1aG98WkRv23GOXNplwpqxd++lQVZ0Yjpcrnuc1Aj232mqrvBoY2QQ4bZE6YARwaiIavxG4
                P5Zs8AqBPLbPoYB/z0KB3/72gHXA6GeeffkBFblaVc4W0fJMMw6071OQMarG1D167fSdD28ZG6FAqBqoUghe1ns+aS8NzJWngBtiyYZXMsYv6B9zE+QX//Har1R1hKr2DkzMFJE5qnrzXnvu8j5sekP0
                iy++HCrCxHzwPH+j0fO8ntFo6fLATZUUMAsYGUs2fBRChMKB5oUXX+WgIEF+7fU31bG8M1TlKBGZus/eu70YnpebLG+MfPnll0OhGaCvbB6eF0D0vEbXdXt26bJplUgpAYayFhgJ3B5LNnwXgiwE8aVF
                S1BD2S++R4u/vbZ4ad58D2DNmk/o1q0rAKtXr8EwDLp06VwUYKbJ+gBdXNcH2K1b13aPwm2VLsBY4MVENH4CNGtgvoj96/33Yr/4Hrz62ptZxxcvaQlvVeNqGhvXANCtW1dWr15T9ckna7etr++WF16m
                ZMPzcF0Xx/VwHBfHcQp+rqQABYh4YHhtOr0XsCARjT+UiMZ75YLMlX332T1rf++9suE1Nq6hLKLp
                nt3q1Z8coKrPicglrS2kJbwAoO1gOw6mXRhgyaKwemAp3srqSMrwsHpssKu0beMfBxyeiManAzfF
                kg2fZkIsZNqhfLxqNYZAfQCusXH1z0T1GhU5W1UjIrK4NXieBx4enpuhfY6L7Tg4toNl2+0LUD34
                qky9abFa5+3a8kqFR//6xqd//iaiQz04h9Y1vRq4GDghEY3fDMyKJRtSxUAmEqtQbW6zJxKrOhiG
                MVhELlORqAbJcWtJcUawwHVdXNfDcX1wdgDPtAoDLIkJCzC/a7W1uGNFRFXQsrIPO3312tIeyYbz
                gH7A120cKgZMBZ5LROOH5QMXSiQSoXv3et5/7339eNXqk9TQRSJyk6qm4WXUs0UAukGwcHFcX+ts
                y8GybEzTIpWySKVS7QdQPfiyTO03OlW4NYZBxw4d6RKNpp1GLNkwHzgV+HYjhv0V8EQiGr8rEY13
                ygexvt6PsGWVFeNVZL6huoth+OAMw8ibGOcT398FwcJ2sG07Da8pZdLUlKKpyWw/gILHBkMjbsfa
                yi7RKNvEevCLX/TcCsAbdEsIcSHQqjNvMTScBvQodMIHH3xkqOouYS0cAlRteykSRtnQXC3TxjRN
                mlImqZSJaZqYKavg57+/D/TAiBh037qen3TpwjY9urN19/pdPM8rExErzPFiyYaZiWj8COCkjRi9
                yZ+hwOLLDAxDbcnoIuearNdKRuC4Dq7jYgXaZ5pW1su2Laz29IEeUCVq79azZ9Nee/Vizz1355c7
                9txt7drPtgOoWf54ZlpyIxtnykVFCLRO8/u7sKooJqG/s6zQ32VoXvrVjj7QFajaYGq8a31k5113
                or7bT+hQW1NdWVneD6Curo5/3zcGgOAWwGOlAqhaltGCyv6bn9t5RRsBgO/vrOZg0RKeiWkWNuHv
                H4VF0HUbtMvqpLtFXScqKsoRgXXrNpyzYuUH9QDvf9CYqYX3lwpgWVmkgOb50Fy3dYCmaZJKWTQ1
                ZcNr3rbaGSCAofC3Fw1NmW7Ksvn8i6/5ZO3nPT74cPVVAH84L+tJosXAmlJMG8njwcMuSgjPcYsD
                9INFKkvjUqaJaVn+y7QwrXaMwv6VGLhL/6XfPPq8s/bLb1i9+lPnnXdX8ubS5d3DU8JUJJZsaMRv
                KJRUPDKqirAUc5yidSyQ1+dZpoVlmlimiWmZWEUAlqaUEwHbEXvqvfp+ZUVq5dqkfvPVt4bnef8q
                8IlPSzOtpKGF/i6rlnVdXMctOoZpmkHuZ6WDSXrbttJ5YSEpXTMhYuA1rmXF4mX61dfflQV31VYA
                3DBicm6DoK40ALODhZsJz3H93K7IxQOB9oVpS6CFlm+2viZa2FZ7+0BAPI8NNVX2+tpqV32n7gL/
                Brjx+iHp8xLReAzYZpMmyRHPc4P3AFxGUmyHSXGRiwcwrexoawbQLNNKa6NptrcJBwDX11RXWOVl
                nuH7nfVAuvOcUY5dCERLAlAF13YzGgEudlCS+VWFVbSTAmCaFk5gppZtYWe929i2jeO0czfGvxr4
                sq5TCqgAEJGPDcP4Cghvb1bjd6KHbPok2aKeYrm2b7q5JZllk0qZrZqwZZqBxmb7vSyA9g/gAwX4
                MrqlpYZSUVFOTXXlh9dePTCz6ugIlPSh3rTmOdmtJzPI6/zcLlV0DNO0sCwzeA8gmn4KY1uBJlo/
                gAa6Klh1W9TU1lZTpUokYnyo2Qnu58DHQLdNmyHPnBCkKn4tG158Ku3P/AhbTCzLwnFCE7YD7bPS
                ftR2bGyrcCQvTT/Q8zCrKh261jmdaqroUFtFbU3VewCTptwNQCzZYAGflAoegOM2g/N7dyYbgvZT
                Zm5XTNLBw2oOGpbtm7KVYdbtChDXw6qpdnTrrnaH6ipqa6qpqal6ByC+316ZKcyHpQTo2a7v6wJ4
                TU2pdPHvv3yQxcQHlgEvnQ/6ftAOtLKQlMaEPQ97yw7lVXWdKPd9oF1eUfkFwN69duDNZStg5+0A
                VpYSoO01Bwr/3TfbEIIZBIjiAG0cx0kHDydtuk4QgZ0fBqDVo2uqtmNteceqKqemtkYQnfvPt9/7
                8+q1X83dfeftwqt4r5QALdNOJ8K58Kyglm3VB9omju1m+Ds7uJkUvLdSDrZmwm1r7boukR22TW2z
                w3Z29x71xhadOhi11ZXbV1aUz+nRbaunl7y5/CAAI/l5ArDbNGYbZMN6K222eSuKoJ5t7Z+Q6e9C
                k814qW3bBTkUA+jifwu1VfEiBh2feKl2y2deoUNttdexbgs6dqihQ20VVZUVB5eVRZ5evGzlrV9f
                OSiK45QskJjmhnTwaNnD80uxYq0ooBmc5UffdCQObmk6jvOtU8QPFAQYSza4QH9gOlD832gY8N6H
                ag75U1mq/9Vu+VvL7Y51nbzaTh2orq6gsqI8YnjuwHX9jl5g7bjtVmKXRgn9NlQqL7x0PdtKKRcG
                CivD7wUvz3GdexzHPXb2rCkFk8m8PjDjXuwHwMBENH43cD3Qm4IjRcCD1JOLItbL//RqTu/jVA49
                Q9zOUcNyPf/+gmqdvW3MLV9WGldoBq2o5m5Ks/8Lj9mttLMs2/YT8UDjbMfGdd1XXNcdPmP6hCcB
                hlx4GevWmcyeOaltADO/YhHcEPpHcEOoH3Ad8Iu8qxGQinK8lCnfTpsX2fD4C27ZeSdbZSccrpGa
                KkPWN2H36PYdflXyvWXDer9fZ1t2dgsqeA8jbDGxbdtzmoPFR67r3pxKWbPmzJ5sApw74CImTxxT
                8PNFg0gOSCeWbJgL7AfcAHxReFRFqipx1nymTcMnlblnXu5FnnnFFBXX6d61otVbZW0U07UwUxl3
                0YIWlGlld1NaAVjuOI7pOM4Y13Hj028dd+uc2ZPNAQP9u7Azb59Q9PNtSmPC7zoH218AIxLR+Dx8
                sz6t4D8iYvh9wreWRyqG3ex1PCRuWztvb3iVFeC6bNRXSfMB3JDCssx08yArCATbrWmg4ziveK53
                4K1Tx7waHhsw8BJuv21cm9bQ5jwwj1m/B5yZiMZnA8OBAwp+uLwMPE+qnnq5rPKFxb76fU940FyG
                pf2dnVnP2gHAwgFr8NArmDJpVPpbs4POvwzXc5l+a9vgbRTATJCZX/iJJRueTUTjLwJnA9cA+Z9Q
                FsEri4DrSingAdim4/tA28nRvuakuJgGZrb7z79gGNOmjt7oNWxSJZL7Pb7gAZsZiWj8YWAYcAHQoRDIUkmTlfJb7nZzKea/mtMRtwjATGCbAm+TARYBmQSuCvzjtcDJmzx4GyTsoDQDbAaXUYq115MIQIm6MXlALo0lG/oCfYDX2xtgmMLYYRO02Re+6zjOgh89wBBiHpCP4QeXC/EfmSqp2FYKM92GD/t4NrZtf+44zrW248SnTRn99EUXX8P5g4e1C8B2Ue+cQLMBmJSIxh8CrgAGAJWlmMc3Xyt9T8O2Hdt13bscx/nLlEmjVgAMvegqTMtk2pRN83GbBWAIEbLSnlXAhYlo/E78p5i+968jOpaLZVplQRXxvOu6IyaOvyn9I2ODh17BpAk3t9clAj/AYw55zHpJLNlwFNAXeOv7jP31t9+qbdvvOq478Jtvvusdwrvw4qsBmDJpVHtfXvtpYK7kyR/nJ6Lxhfi3OS8BOm/smKZp2rZtD5004WYb4NJhf8S2HCaOv+mHuqzNI7kP1CSi8Z8novHpiWjcSkTjXsZrXSIa3ynfGJcOuy5r/+JLr90s17LZfkM13+MLiWj8QPxGRfhbneuBfWLJhnc21zpbk83+K765IBPRuOI3KIYDPwd2iyUb3t7c6ywkmx1gKHlARoFzgQdiyYaS3s37j5Y8/jHvs3M/Fvk/f8KSuqInjIIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMDEtMjlUMDQ6MTU6MTIrMDA6MDBAQt6WAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTAxLTI5VDA0OjE1OjEyKzAwOjAwMR9mKgAAAABJRU5ErkJggg==" 
            />
        </svg>
    )
}

export default HiveAuthenticationServiceIcon