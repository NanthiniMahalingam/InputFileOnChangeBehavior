using InputFileHybridMaui.Shared.Services;

namespace InputFileHybridMaui.Services;

public class FormFactor : IFormFactor
{
    public string GetFormFactor()
    {
        return DeviceInfo.Idiom.ToString();
    }

    public string GetPlatform()
    {
        return DeviceInfo.Platform.ToString() + " - " + DeviceInfo.VersionString;
    }

        public string GetHost()
        {
        return ".NET MAUI BlazorWebView";
        }

        public string GetWebViewRuntime()
        {
    #if WINDOWS
        var version = Microsoft.Web.WebView2.Core.CoreWebView2Environment
            .GetAvailableBrowserVersionString();
        return $"Microsoft Edge WebView2 {version.Split(' ')[0]}";
    #elif ANDROID
            if (OperatingSystem.IsAndroidVersionAtLeast(26))
            {
                var version = Android.Webkit.WebView.CurrentWebViewPackage?.VersionName;
                return $"Android System WebView {version ?? "version unavailable"}";
            }

            return "Android System WebView version unavailable";
    #elif IOS || MACCATALYST
        return $"Apple WKWebView ({DeviceInfo.Platform} {DeviceInfo.VersionString})";
    #else
        return "Unknown WebView runtime";
    #endif
        }

        public string GetPicker()
        {
    #if WINDOWS
        return "Native Windows file dialog";
    #elif ANDROID
        return "Android system document picker";
    #elif IOS || MACCATALYST
        return "Apple document picker";
    #else
        return "Host platform file picker";
    #endif
        }
}
