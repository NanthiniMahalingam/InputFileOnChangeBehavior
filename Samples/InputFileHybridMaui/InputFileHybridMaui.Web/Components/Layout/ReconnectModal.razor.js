// Set up event handlers
const reconnectModal = document.getElementById("components-reconnect-modal");
reconnectModal.addEventListener("components-reconnect-state-changed", handleReconnectStateChanged);

const retryButton = document.getElementById("components-reconnect-button");
retryButton.addEventListener("click", retry);

const resumeButton = document.getElementById("components-resume-button");
resumeButton.addEventListener("click", resume);

function handleReconnectStateChanged(event) {
    if (event.detail.state === "show") {
        reconnectModal.showModal();
    } else if (event.detail.state === "hide") {
        reconnectModal.close();
    } else if (event.detail.state === "failed") {
        document.addEventListener("visibilitychange", retryWhenDocumentBecomesVisible);
    } else if (event.detail.state === "rejected") {
        location.reload();
    }
}

async function retry() {
    document.removeEventListener("visibilitychange", retryWhenDocumentBecomesVisible);

    try {
        // Reconnect will asynchronously return:
        // - true to mean success
        // - false to mean we reached the server, but it rejected the connection (e.g., unknown circuit ID)
        // - exception to mean we didn't reach the server (this can be sync or async)
        const successful = await Blazor.reconnect();
        if (!successful) {
            // We have been able to reach the server, but the circuit is no longer available.
            // We'll reload the page so the user can continue using the app as quickly as possible.
            const resumeSuccessful = await Blazor.resumeCircuit();
            if (!resumeSuccessful) {
                location.reload();
            } else {
                reconnectModal.close();
            }
        }
    } catch (err) {
        // We got an exception, server is currently unavailable
        document.addEventListener("visibilitychange", retryWhenDocumentBecomesVisible);
    }
}

async function resume() {
    try {
        const successful = await Blazor.resumeCircuit();
        if (!successful) {
            location.reload();
        }
    } catch {
        reconnectModal.classList.replace("components-reconnect-paused", "components-reconnect-resume-failed");
    }
}

async function retryWhenDocumentBecomesVisible() {
    if (document.visibilityState === "visible") {
        await retry();
    }
}

// SIG // Begin signature block
// SIG // MIInXgYJKoZIhvcNAQcCoIInTzCCJ0sCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // KaaPAWmPt4DMSshtTVWM48+H08LhHZcjR9tpthFLkmig
// SIG // ggy4MIIF8zCCA9ugAwIBAgITMwAAAceaoe7cJ+L4twAA
// SIG // AAABxzANBgkqhkiG9w0BAQsFADBXMQswCQYDVQQGEwJV
// SIG // UzEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDI0MB4XDTI2MDQxNjE4NTczOVoXDTI3MDQx
// SIG // NTE4NTczOVowYzELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjENMAsG
// SIG // A1UEAxMELk5FVDCCASIwDQYJKoZIhvcNAQEBBQADggEP
// SIG // ADCCAQoCggEBAMB61gBm+zIpG+zndRVKQsKhMDkm93i+
// SIG // sXwp1OHJ+EGnqv1EntlMxQ3XglhWpxS83yMw+VBm/IAT
// SIG // tMIr2/2LITEnBBgY8+EA+SCxn1G0cBlR0WhlEvQs49DG
// SIG // k4iUoAbAyEDjThvokHS6apuvqwViuP+cFci9SS4x6a45
// SIG // h+ujrl5qy77RkgYpBhapvgPLM1zvtPsCzh1t7j2K/05r
// SIG // 4JJAJqWIPZ+PjSvXJLKW95EH3vxPhtfdhm6sEK4xpcKM
// SIG // CG7qsL/dCqhGeHk+IQgxTecwZyWbMyY305PiUnGcc728
// SIG // 8wHNr36J3Z8c5BWFWptyocQafTXjiMil7OS8KYmhgHYg
// SIG // 6xkCAwEAAaOCAaowggGmMA4GA1UdDwEB/wQEAwIHgDAf
// SIG // BgNVHSUEGDAWBgorBgEEAYI3TAgBBggrBgEFBQcDAzAd
// SIG // BgNVHQ4EFgQUgAm0ef/T6uytGybTjdg8DFX/L58wVAYD
// SIG // VR0RBE0wS6RJMEcxLTArBgNVBAsTJE1pY3Jvc29mdCBJ
// SIG // cmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEWMBQGA1UE
// SIG // BRMNNDY0MjIzKzUwNzYwNjAfBgNVHSMEGDAWgBR/WT9U
// SIG // IdqtT+8F5eaj1y0GlBIIMTBgBgNVHR8EWTBXMFWgU6BR
// SIG // hk9odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3Bz
// SIG // L2NybC9NaWNyb3NvZnQlMjBDb2RlJTIwU2lnbmluZyUy
// SIG // MFBDQSUyMDIwMjQuY3JsMG0GCCsGAQUFBwEBBGEwXzBd
// SIG // BggrBgEFBQcwAoZRaHR0cDovL3d3dy5taWNyb3NvZnQu
// SIG // Y29tL3BraW9wcy9jZXJ0cy9NaWNyb3NvZnQlMjBDb2Rl
// SIG // JTIwU2lnbmluZyUyMFBDQSUyMDIwMjQuY3J0MAwGA1Ud
// SIG // EwEB/wQCMAAwDQYJKoZIhvcNAQELBQADggIBAImzEt/g
// SIG // Gt+QAA3NGlRZUv+koTULWxSFT/osH1YxbVKFgSYU9dA9
// SIG // BpFDzo1lF+IhVTgjjwHXhaA87P4YTztl3RQfrlrrED7F
// SIG // 008DHiJ+G/7nnTxkb7y9fNRTTw9Ac/hGTWkQBW5Vaujm
// SIG // gWQflToTpMKNlqVbGFg+UVZKxi+k5MhsULjKt5K/ulH5
// SIG // bVuvnXrZmeF3XRGuSsQe2YjpNYaYHq713itwdNwyYq7p
// SIG // rpQ4R3xiUBw6SOOaH2UyDdhyQisZl8V3wFNhY2t6yZkQ
// SIG // CyGG+GZF49Q8vc1l+Tl+pcRa8l+4u3Rq18QUDJenW4Up
// SIG // 5y/a+mLTyxM8pYRQpPDqVX5U9NTfLbgZWKxQmkN+0mpJ
// SIG // 4CRpAniIiJJC4ag7Wjky+Asgik8xb/16wqiw72xDdPCk
// SIG // 7TN0g/G4PlmyyDP+hdSjzlq5JiQK2ubfEhAqoRD1tmKK
// SIG // 4R3QqIFlLZsPjE87AXlZ4PJHzutH2YnNsUQ45oDDCf3j
// SIG // 6vfslGL01M3XAgkDXhskyOXxb1v7of0JR8GzCvsIkNeM
// SIG // QmeXc5FZwi7xXG6UeNh1Z4SA3qJo+H+ItV/dMgjxCWPl
// SIG // Yfzgh6a2CXXaEruZvnLpwD+cCuZxYhGYIJfrsWoCh4Gf
// SIG // AtkvG3Z0fHgeftB90byXroQbupqohCUppbug9df+2PjO
// SIG // aPWk0oPvu/4HzFaZMIIGvTCCBKWgAwIBAgITMwAAADk7
// SIG // tjcZvwYdZwAAAAAAOTANBgkqhkiG9w0BAQwFADCBiDEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWljcm9z
// SIG // b2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IDIw
// SIG // MTEwHhcNMjQwODA4MjA1NDE4WhcNMzYwMzIyMjIxMzA0
// SIG // WjBXMQswCQYDVQQGEwJVUzEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQDEx9NaWNyb3Nv
// SIG // ZnQgQ29kZSBTaWduaW5nIFBDQSAyMDI0MIICIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA2AGcHuM4x6qV
// SIG // Fgc1rbrm/ghj18fxMqF6Yd88g17WCktpXd2GDfbhbAfT
// SIG // otwdumewG6QIM2K2vKjR21L8Rboj/IQv9stJjyEqlt9C
// SIG // 5a6wE+v2prNhwPEJb+qeNvkmwjWzxs06DdtUBO9BUvi1
// SIG // x/TdpPJyzPxB4J0zSX/IdE5sn1CprMzWvpU8Q4nssv64
// SIG // QRvvfDpAK6Gzz1rW6/XN6s5gyeyd5FHAJunJbXUhyCBT
// SIG // RxEoMOrWmNUnMhsgXr6iJddtF46yB4jzO7UXJB8rR9WR
// SIG // rJrxKZUdD+05/beZnhb2TRGLbZBb2ndSBILk5QOS0rHF
// SIG // wKYYvq1ct84ZJYcghXhitMlNPo823LlESiMcm5kcCuQX
// SIG // 1WcdMRFahOMDN8jeQ/7lvhqVR2GABnu2067VtWdd8dqo
// SIG // 9iXas+zbSOLTcs5VayH+tp2ATXt6zmEv63qVXR5UetWG
// SIG // yyxE5Ym7PYxcwK3uLDuUU8b0tcoaOyaiefaCi0Z0ci4S
// SIG // DkmckwlWaLF3ktGWSaBhFkrOHFILDKgYirQ+FoDtj5U9
// SIG // y3mkIeSKNwggObSeWQr7QrJ6miVyoabRP8ZhBEyEcmUY
// SIG // 46ZVCinfrBRVRiSVTL768NZ4SASjizuHE3qYht/YxIhD
// SIG // +Ih8xmAnELr2i6QxRcKs4LdKQT/EiSCl+XbYwzWK2Rnf
// SIG // mc1eQyiVTWUCAwEAAaOCAU4wggFKMA4GA1UdDwEB/wQE
// SIG // AwIBhjAQBgkrBgEEAYI3FQEEAwIBADAdBgNVHQ4EFgQU
// SIG // f1k/VCHarU/vBeXmo9ctBpQSCDEwGQYJKwYBBAGCNxQC
// SIG // BAweCgBTAHUAYgBDAEEwDwYDVR0TAQH/BAUwAwEB/zAf
// SIG // BgNVHSMEGDAWgBRyLToCMZBDuRQFTuHqp8cx0SOJNDBa
// SIG // BgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3JsLm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNSb29D
// SIG // ZXJBdXQyMDExXzIwMTFfMDNfMjIuY3JsMF4GCCsGAQUF
// SIG // BwEBBFIwUDBOBggrBgEFBQcwAoZCaHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNSb29DZXJB
// SIG // dXQyMDExXzIwMTFfMDNfMjIuY3J0MA0GCSqGSIb3DQEB
// SIG // DAUAA4ICAQAUlB84KE/uiefp8sgwqtKU3VZgrAMWAB13
// SIG // KY5Q7cWszx3sH9b+JDoPFewOfsPlbjAzBh4vKy1wSp+S
// SIG // PPg1RFGBrPIy7nJHNCHguqMDi1K1NwmHWikTGjuefk+4
// SIG // 8Fidu7T5MdK5UdN7RVNM9WGKXL+mIWsOjdrFD0/gL46X
// SIG // nJ637aBN96QgJLnFL5xh9Ii+CfQmSxUFUxhUjlAW7+qG
// SIG // cuGwQURTMbx++/SGOCQ76WSlX23LoaQ3i92d3vJrpDpp
// SIG // H3LfhqIzWqbFrEGLo5SfI2Xp+S66f92JMWdgMtOmk6Sv
// SIG // +aDlZJ8KINUw0LG2PjA8oLk6YebUNAi38w2iRtsfdQaw
// SIG // U/VBvOwuhy5KosK8fT0ijd8M9OaxxH1jvkbipftFNfwB
// SIG // 0E+jQjo4SiN/f3O4Vm3So4ebrlhZATr1xkza54TUwHTl
// SIG // 002Acr2BMTvMq8r9+DwHaqNbzwxP9YXlXm69ka2pr0VI
// SIG // vZFrMCsD6sM+5/okZjPgemAxkcHhLqzNZIpgG/RWKwLN
// SIG // /GB5T52q5db1t3Rq5iU4HnwM9w5gp1zdJ73iD7EvilwS
// SIG // FsHngk6ACTBhO7/10t4fakOp4lkAAFUNZFAJpd87kuDI
// SIG // rAoIthemKCtlgKNRIFyv5V7w8VYyFVNCXS/irwn8BSZA
// SIG // 3lbifXTVxjYvgDsZNAbWHfYccC99ARJY/TGCGf4wghn6
// SIG // AgEBMG4wVzELMAkGA1UEBhMCVVMxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWlj
// SIG // cm9zb2Z0IENvZGUgU2lnbmluZyBQQ0EgMjAyNAITMwAA
// SIG // Aceaoe7cJ+L4twAAAAABxzANBglghkgBZQMEAgEFAKCB
// SIG // rjAZBgkqhkiG9w0BCQMxDAYKKwYBBAGCNwIBBDAcBgor
// SIG // BgEEAYI3AgELMQ4wDAYKKwYBBAGCNwIBFTAvBgkqhkiG
// SIG // 9w0BCQQxIgQgKvz/b4sY8F9cD7znYr44Sc1eRyTy//J5
// SIG // aP51v7HcSPYwQgYKKwYBBAGCNwIBDDE0MDKgFIASAE0A
// SIG // aQBjAHIAbwBzAG8AZgB0oRqAGGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASCAQC60r8g
// SIG // 1gOnHp7m0xLe6heaLVuIiM+AsvsYAfvMf/RoVJdrWqWM
// SIG // r7PuxLNgFwp5h7UpEyieGdOW5jYwmGIY54JCYGUnsqDz
// SIG // GrYJEHL5s6114JVmdaWu+CMxwhop/HUKuvtu+2sNosVb
// SIG // VyumCRl2fNtPHK82hlmj1koJC8P1BInYfSpgb27qFBlZ
// SIG // Z0Bd2ncK+Rw7J8cZG3LwHGoHx/g7tTVLhQnzdx1z6jYS
// SIG // U7+6XOK0bt9PFcby8mtxUnlBCC6CY6dGaqKqFOfQ4ZHI
// SIG // AR6ped4Oitk4+gHWvV3jt1QkYF2mn+E199MJL9isFBc2
// SIG // rnf9XbH9mTEHY/9FCT3Xtr13/VYOoYIXsDCCF6wGCisG
// SIG // AQQBgjcDAwExghecMIIXmAYJKoZIhvcNAQcCoIIXiTCC
// SIG // F4UCAQMxDzANBglghkgBZQMEAgEFADCCAVoGCyqGSIb3
// SIG // DQEJEAEEoIIBSQSCAUUwggFBAgEBBgorBgEEAYRZCgMB
// SIG // MDEwDQYJYIZIAWUDBAIBBQAEIJ5iFpu7BPq1DFFYe9SM
// SIG // NkFaxyGYnF8oIMQERImd5N3AAgZqY255bc8YEzIwMjYw
// SIG // ODA3MDAyMTA0LjY4M1owBIACAfSggdmkgdYwgdMxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xLTArBgNVBAsTJE1pY3Jvc29m
// SIG // dCBJcmVsYW5kIE9wZXJhdGlvbnMgTGltaXRlZDEnMCUG
// SIG // A1UECxMeblNoaWVsZCBUU1MgRVNOOjQwMUEtMDVFMC1E
// SIG // OTQ3MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBTZXJ2aWNloIIR/jCCBygwggUQoAMCAQICEzMAAAIZ
// SIG // XrLYVHX0sY0AAQAAAhkwDQYJKoZIhvcNAQELBQAwfDEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9z
// SIG // b2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMjUwODE0
// SIG // MTg0ODI2WhcNMjYxMTEzMTg0ODI2WjCB0zELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEtMCsGA1UECxMkTWljcm9zb2Z0IEly
// SIG // ZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVkMScwJQYDVQQL
// SIG // Ex5uU2hpZWxkIFRTUyBFU046NDAxQS0wNUUwLUQ5NDcx
// SIG // JTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNl
// SIG // cnZpY2UwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIK
// SIG // AoICAQCmoUjJSTMjLGkvdDTdaYu7Lgb1ghRJzOeEqv5w
// SIG // c5P7+7s9qvEj3qDHFvVata4DEHyqMYt+xsibHxXei4rW
// SIG // dRx/5H+eyddqzn+JOBX9OXdBNEZPQN65cE1ukepz7ALU
// SIG // 2JPIDvqAueKu9IESgHOWuk1AUSe7B1s8sIulNLcpZIK7
// SIG // knTZv5EVZH+RwXNXGeGgTeAhp5RG2sYoYFkYosFe+qCC
// SIG // QMQ20qS+29FPfbEu8C8v9GlF67nPXxmiMKzvZlKhrvgP
// SIG // LxhtpawObc5k6klFnFmw8oIdnrE2qAUp/TE0ePS32/RD
// SIG // db7bPmABVpqwkkK9HnZKXRcnYA5/eXQtJ61eBQDmAPkh
// SIG // DVG8SyVOY2dKi5OsYgPcPWeNjuYG7Sm6Ih08raMr/VZ5
// SIG // 5/b5hHhxClZCR4FmZeJ2H0C5Z2XDEpAvXksnorZ3DzL+
// SIG // 388GGYvK3pAB/QJ6lZF2BmczK1UBS5YfCVlFX0ktjtpf
// SIG // wPnl4v35w4ulfdsY06Y3bhSkhbyq1lqpdp6wW8g5bbck
// SIG // 0uFppBW85uvV67sYT/kyfjd778Nu11iX9ss/YhDXFgQl
// SIG // 1JtxSQMV9bcqVkSH6cEoO1pGc1GRuAiDEhsp1Pfw4pDB
// SIG // n9oDi5KyICDqcQ+JYEca7K0ijnBTvkzlV2OESqpMd9di
// SIG // 7wEmLoZPO9ZP716R8xd7OoKSSzFobwIDAQABo4IBSTCC
// SIG // AUUwHQYDVR0OBBYEFIBo6jkdZq03OpmfUgXV9wPqevch
// SIG // MB8GA1UdIwQYMBaAFJ+nFV0AXmJdg/Tl0mWnG1M1Gely
// SIG // MF8GA1UdHwRYMFYwVKBSoFCGTmh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbS9wa2lvcHMvY3JsL01pY3Jvc29mdCUy
// SIG // MFRpbWUtU3RhbXAlMjBQQ0ElMjAyMDEwKDEpLmNybDBs
// SIG // BggrBgEFBQcBAQRgMF4wXAYIKwYBBQUHMAKGUGh0dHA6
// SIG // Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY2VydHMv
// SIG // TWljcm9zb2Z0JTIwVGltZS1TdGFtcCUyMFBDQSUyMDIw
// SIG // MTAoMSkuY3J0MAwGA1UdEwEB/wQCMAAwFgYDVR0lAQH/
// SIG // BAwwCgYIKwYBBQUHAwgwDgYDVR0PAQH/BAQDAgeAMA0G
// SIG // CSqGSIb3DQEBCwUAA4ICAQBfHNVkstcEV+gIIJOJjswd
// SIG // d1vtyK8lJN+sdgkLk6TY03vk2nNMxP1XZNwhCN9DcAVR
// SIG // uHU0EBi0xS7DELoPhx4RcbmVcCdu+QL1iN4tUNHIiZdh
// SIG // iZ+3vP5CmX23cL/xrS2Kqc7PxR7z8Ngu0xOC9Yyeyos2
// SIG // MgsNoiY5+ccjfpMsKMYV7xFgtcZ0JR04uV8B0wZ4/FJM
// SIG // DdMAA5z4ZBuY9aOuC4tZvG+eXc1WNG+sFlWTEUyhVkfR
// SIG // /uobAM5KGOme/mdidDjy58vS4HPnZFs8Z1fgW/35QY6s
// SIG // GmuZwfOYi60W0l5zZjiS6M21MrbAEaBaxwQ5WEWJpV2N
// SIG // 7xUsnsxU0oTlOay4YzeNMuvWe5HkAUazdQqQ/uDdxAPh
// SIG // wcrtd0uJObt7rTpAn5ap5CwANgT129T3AhRsj0OXhRwg
// SIG // SsXD4UdpZJOuR8nhK8uaEqeXmSGGknWwXfPp7UHF6lSW
// SIG // JcerNEuIdaKFYhYRIXwgcSUXc87Fs/hUmocGJi9pcxXR
// SIG // LJGDCgPrNd11tSdf1ZHokvYGWoCOMfEg3B6Wyn9WHEBZ
// SIG // OHO4wDnwvG8T9UDON8UXhabtrVkAuYlXDegv+z+7GjU6
// SIG // ni1xP6F9n243WG0LUk3gO5GoV8u22O6gCZRChs7nNQVH
// SIG // O8KfwKT+GI75vNHXmyqSOXEszIyOmRz95/hJRSKQPjry
// SIG // 9TCCB3EwggVZoAMCAQICEzMAAAAVxedrngKbSZkAAAAA
// SIG // ABUwDQYJKoZIhvcNAQELBQAwgYgxCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xMjAwBgNVBAMTKU1pY3Jvc29mdCBSb290IENl
// SIG // cnRpZmljYXRlIEF1dGhvcml0eSAyMDEwMB4XDTIxMDkz
// SIG // MDE4MjIyNVoXDTMwMDkzMDE4MzIyNVowfDELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBIDIwMTAwggIiMA0GCSqGSIb3DQEB
// SIG // AQUAA4ICDwAwggIKAoICAQDk4aZM57RyIQt5osvXJHm9
// SIG // DtWC0/3unAcH0qlsTnXIyjVX9gF/bErg4r25PhdgM/9c
// SIG // T8dm95VTcVrifkpa/rg2Z4VGIwy1jRPPdzLAEBjoYH1q
// SIG // UoNEt6aORmsHFPPFdvWGUNzBRMhxXFExN6AKOG6N7dcP
// SIG // 2CZTfDlhAnrEqv1yaa8dq6z2Nr41JmTamDu6GnszrYBb
// SIG // fowQHJ1S/rboYiXcag/PXfT+jlPP1uyFVk3v3byNpOOR
// SIG // j7I5LFGc6XBpDco2LXCOMcg1KL3jtIckw+DJj361VI/c
// SIG // +gVVmG1oO5pGve2krnopN6zL64NF50ZuyjLVwIYwXE8s
// SIG // 4mKyzbnijYjklqwBSru+cakXW2dg3viSkR4dPf0gz3N9
// SIG // QZpGdc3EXzTdEonW/aUgfX782Z5F37ZyL9t9X4C626p+
// SIG // Nuw2TPYrbqgSUei/BQOj0XOmTTd0lBw0gg/wEPK3Rxjt
// SIG // p+iZfD9M269ewvPV2HM9Q07BMzlMjgK8QmguEOqEUUbi
// SIG // 0b1qGFphAXPKZ6Je1yh2AuIzGHLXpyDwwvoSCtdjbwzJ
// SIG // NmSLW6CmgyFdXzB0kZSU2LlQ+QuJYfM2BjUYhEfb3BvR
// SIG // /bLUHMVr9lxSUV0S2yW6r1AFemzFER1y7435UsSFF5PA
// SIG // PBXbGjfHCBUYP3irRbb1Hode2o+eFnJpxq57t7c+auIu
// SIG // rQIDAQABo4IB3TCCAdkwEgYJKwYBBAGCNxUBBAUCAwEA
// SIG // ATAjBgkrBgEEAYI3FQIEFgQUKqdS/mTEmr6CkTxGNSnP
// SIG // EP8vBO4wHQYDVR0OBBYEFJ+nFV0AXmJdg/Tl0mWnG1M1
// SIG // GelyMFwGA1UdIARVMFMwUQYMKwYBBAGCN0yDfQEBMEEw
// SIG // PwYIKwYBBQUHAgEWM2h0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2lvcHMvRG9jcy9SZXBvc2l0b3J5Lmh0bTAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDCDAZBgkrBgEEAYI3FAIE
// SIG // DB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0T
// SIG // AQH/BAUwAwEB/zAfBgNVHSMEGDAWgBTV9lbLj+iiXGJo
// SIG // 0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEugSaBHhkVodHRw
// SIG // Oi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9k
// SIG // dWN0cy9NaWNSb29DZXJBdXRfMjAxMC0wNi0yMy5jcmww
// SIG // WgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRw
// SIG // Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01p
// SIG // Y1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNydDANBgkqhkiG
// SIG // 9w0BAQsFAAOCAgEAnVV9/Cqt4SwfZwExJFvhnnJL/Klv
// SIG // 6lwUtj5OR2R4sQaTlz0xM7U518JxNj/aZGx80HU5bbsP
// SIG // MeTCj/ts0aGUGCLu6WZnOlNN3Zi6th542DYunKmCVgAD
// SIG // sAW+iehp4LoJ7nvfam++Kctu2D9IdQHZGN5tggz1bSNU
// SIG // 5HhTdSRXud2f8449xvNo32X2pFaq95W2KFUn0CS9QKC/
// SIG // GbYSEhFdPSfgQJY4rPf5KYnDvBewVIVCs/wMnosZiefw
// SIG // C2qBwoEZQhlSdYo2wh3DYXMuLGt7bj8sCXgU6ZGyqVvf
// SIG // SaN0DLzskYDSPeZKPmY7T7uG+jIa2Zb0j/aRAfbOxnT9
// SIG // 9kxybxCrdTDFNLB62FD+CljdQDzHVG2dY3RILLFORy3B
// SIG // FARxv2T5JL5zbcqOCb2zAVdJVGTZc9d/HltEAY5aGZFr
// SIG // DZ+kKNxnGSgkujhLmm77IVRrakURR6nxt67I6IleT53S
// SIG // 0Ex2tVdUCbFpAUR+fKFhbHP+CrvsQWY9af3LwUFJfn6T
// SIG // vsv4O+S3Fb+0zj6lMVGEvL8CwYKiexcdFYmNcP7ntdAo
// SIG // GokLjzbaukz5m/8K6TT4JDVnK+ANuOaMmdbhIurwJ0I9
// SIG // JZTmdHRbatGePu1+oDEzfbzL6Xu/OHBE0ZDxyKs6ijoI
// SIG // Yn/ZcGNTTY3ugm2lBRDBcQZqELQdVTNYs6FwZvKhggNZ
// SIG // MIICQQIBATCCAQGhgdmkgdYwgdMxCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xLTArBgNVBAsTJE1pY3Jvc29mdCBJcmVsYW5k
// SIG // IE9wZXJhdGlvbnMgTGltaXRlZDEnMCUGA1UECxMeblNo
// SIG // aWVsZCBUU1MgRVNOOjQwMUEtMDVFMC1EOTQ3MSUwIwYD
// SIG // VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNl
// SIG // oiMKAQEwBwYFKw4DAhoDFQAxdin9aqp3JvR6eKCst/GX
// SIG // QicDPqCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // JjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBD
// SIG // QSAyMDEwMA0GCSqGSIb3DQEBCwUAAgUA7h8PPTAiGA8y
// SIG // MDI2MDgwNjEzNDg0NVoYDzIwMjYwODA3MTM0ODQ1WjB3
// SIG // MD0GCisGAQQBhFkKBAExLzAtMAoCBQDuHw89AgEAMAoC
// SIG // AQACAgcZAgH/MAcCAQACAhM9MAoCBQDuIGC9AgEAMDYG
// SIG // CisGAQQBhFkKBAIxKDAmMAwGCisGAQQBhFkKAwKgCjAI
// SIG // AgEAAgMHoSChCjAIAgEAAgMBhqAwDQYJKoZIhvcNAQEL
// SIG // BQADggEBABFPE2pMYMV69I/241X1LVi7QmYD7IdFK1/S
// SIG // Htp1GK62fDqDGHJbdSBwuKscXQHt3eaeWpF1aSZSN9qj
// SIG // ZNUfxiTBmNtLcVHA0lrllyZp2q3V1Mkgh3A9NQRw7he4
// SIG // T8o0pCRXVR20DiJD0Lz5lBEfiFQ+RiyZA/54XSURt01g
// SIG // TVGePDl10XgFEh8CxU8S7q95J/oNbdRHy0xF+FhE7Z+0
// SIG // 9aP6VMyUO/Eakc8V9GHA4Ql83rLjqY168KXMNTy7cAx9
// SIG // 8jJwrHwDlXX91/0oZUuygVJ3p+XXzBCnNAi2+4kNZFPA
// SIG // dRW8mE9nWLkXtXTe20lvgl2U1Q6txPeYf0b/HHlGEoAx
// SIG // ggQNMIIECQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQ
// SIG // Q0EgMjAxMAITMwAAAhlesthUdfSxjQABAAACGTANBglg
// SIG // hkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqG
// SIG // SIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCAYPG09N+dY
// SIG // FGMjZR3Lf/cQUSkILyGEEFA3sj9EPxS0cDCB+gYLKoZI
// SIG // hvcNAQkQAi8xgeowgecwgeQwgb0EINyRfrfcTXLUQXfZ
// SIG // XXzNByuyCPMj37ct7uaW+TY55u2GMIGYMIGApH4wfDEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9z
// SIG // b2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAIZXrLY
// SIG // VHX0sY0AAQAAAhkwIgQgOCfkUAf6vA5lF3m36qR7ymml
// SIG // zZwugyS91D/5gr2/j7YwDQYJKoZIhvcNAQELBQAEggIA
// SIG // VBfM6S9fK+IP0I+g9Wd2X3iL1ixYQPQ4IW+X8hm4gE7N
// SIG // tTYVEqp/g3g/TOoSay+hLG1FR8H2N71Cqj08Gb3CMwfB
// SIG // h+9qdaoADzBD0WLp+HEu/ghPR1wd240MPb29e9NOwqgA
// SIG // 9fLl++Je5S8V0jRhpHvv4kvzEO2k6p3G27EdUIUPxm4s
// SIG // GWjPbINbE4od8xez453HGtZQyXL7bM/B1qii9Y1wP2QV
// SIG // yR1SyDYkQLavfD515yGyi5/kiiJnFhllXKfPMgtPBI50
// SIG // OvYZyyMuY4yJeecnPE95C5K8aX5GCpimeFc6UVhdotnb
// SIG // iBhHhfqH/NpmNpJspEK0faDAU+xPTIO6/XyTwDIpzaW1
// SIG // +yH1KHW5UQP1Fmx4srjueI2GZb4gzhtOBgpX1/YbQkO9
// SIG // WK318j6F7RGAgJT5wY4X8d2ZTqN1nDvuzDQui0RUV6Am
// SIG // ys1g3QlTtTzYTUmSBm9wCGYnZ3Rx2PEtEA8d5Yo4RBs+
// SIG // PgXnq5oDV2EbDc4cpl74cbTm3PHOpcP+nA3W0d0BCykW
// SIG // p2d4adZ/h7kXFGboKLjhABOfz6DnD8Anaq9cS3k7zZdV
// SIG // Bl9Y8jLyAQlIizyA2sHOCUEhbgOZDCSGTbmIP78ikDOA
// SIG // E1K9PGm5BchfZflSOH2ui/SY/foQKZ2FGTEsCS3E7rQK
// SIG // sl/V0BJbAksKBfZPr2JxWhM=
// SIG // End signature block
