namespace InputFileHybridMaui.Shared.Services;

public interface IFormFactor
{
    public string GetFormFactor();
    public string GetPlatform();
    public string GetHost();
    public string GetWebViewRuntime();
    public string GetPicker();
}
