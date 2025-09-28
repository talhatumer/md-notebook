# CSS Flexbox'a Giriş

Flexbox, karmaşık layout'ları daha kolay ve öngörülebilir bir şekilde oluşturmak için tasarlanmış bir CSS modülüdür.

## Ana Kavramlar

- **Container** (`display: flex`): Flexbox yapısının ana taşıyıcısı.
- **Items**: Container içindeki elemanlar.
- **Main Axis**: Elemanların dizildiği ana eksen (`flex-direction` ile belirlenir).
- **Cross Axis**: Ana eksene dik olan eksen.

### Örnek Kod

```css
.container {
  display: flex;
  justify-content: center; /* Main axis üzerinde hizalama */
  align-items: center;    /* Cross axis üzerinde hizalama */
}