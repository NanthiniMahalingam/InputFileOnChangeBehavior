using InputFileHybridMaui.Shared.Services;

namespace InputFileHybridMaui.Web.Services;

public class FormFactor : IFormFactor
{
    public string GetFormFactor()
    {
        return "Web";
    }

    public string GetPlatform()
    {
        return Environment.OSVersion.ToString();
    }

    public string GetHost()
    {
        return "Blazor Web App";
    }

    public string GetWebViewRuntime()
    {
        return "Browser runtime (see browser details)";
    }

    public string GetPicker()
    {
        return "Browser file picker";
    }
}
