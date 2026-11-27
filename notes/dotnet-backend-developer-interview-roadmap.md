# 🚀 .NET Backend Developer — Study Roadmap

> **Hedef:** Mid-Level .NET Backend Developer  
> **Çalışma süresi:** 2.5 Gün  
> **Toplam süre:** 18–20 Saat  
---

## 🎯 STUDY OVERVIEW

Bu çalışma planının amacı .NET Backend geliştirme alanındaki mevcut bilgileri tazelemek, teknik derinliği artırmak ve temel backend yetkinliklerini güçlendirmektir.

### Öncelik haritası

| Öncelik | Konu | Seviye |
|---|---|---|
| 🔴 P0 | C# Fundamentals | Critical |
| 🔴 P0 | Async / Await & Multithreading | Critical |
| 🔴 P0 | ASP.NET Core | Critical |
| 🔴 P0 | EF Core & SQL | Critical |
| 🔴 P0 | SOLID & Design Patterns | Critical |
| 🟠 P1 | Clean Architecture & CQRS | High |
| 🟠 P1 | Authentication & Security | High |
| 🟠 P1 | Redis & RabbitMQ | High |
| 🟡 P2 | System Design | Medium |
| 🟡 P2 | Docker & Microservices | Medium |
| 🟡 P2 | Unit Testing & CI/CD | Medium |

---

# 📅 DAY 1 — C# & ASP.NET CORE

**Hedef:** C# dilinin çalışma mantığını, .NET Core altyapısını ve Web API request lifecycle sürecini anlamak.

**Tahmini süre:** 7–8 Saat

## 01. C# Fundamentals

⏱️ Süre: 2 Saat | 🔴 Critical

### Çalışılacak konular

- [ ] Value Type vs Reference Type
- [ ] Stack vs Heap
- [ ] Boxing vs Unboxing
- [ ] `ref`, `out`, `in`
- [ ] `const` vs `readonly`
- [ ] `IEnumerable` vs `IQueryable`
- [ ] `ICollection` vs `IList`
- [ ] Abstract Class vs Interface
- [ ] Class vs Struct vs Record
- [ ] Delegate, Event, Action, Func
- [ ] Extension Methods
- [ ] Generics
- [ ] Exception Handling
- [ ] Garbage Collector
- [ ] IDisposable & using

### 💡 Önemli detay: IEnumerable vs IQueryable

- IEnumerable: Veriler üzerinde uygulama tarafında iterasyon yapılmasını sağlar.
- IQueryable: Expression Tree kullanarak sorgunun veri kaynağına çevrilmesine olanak tanır.
- EF Core kullanırken IQueryable üzerinden oluşturulan sorgu genellikle SQL'e çevrilerek database üzerinde çalıştırılır.
- ToList() gibi materialization işlemleri sorguyu çalıştırır.

```csharp
IQueryable<User> query = context.Users
    .Where(x => x.IsActive);

var users = await query.ToListAsync();
```

---

## 02. Async / Await & Multithreading

⏱️ Süre: 1.5 Saat | 🔴 Critical

### Çalışılacak konular

- [ ] Synchronous vs Asynchronous
- [ ] Async / Await çalışma mantığı
- [ ] Task vs Thread
- [ ] Task.WhenAll vs Task.WhenAny
- [ ] Parallel.ForEach
- [ ] CancellationToken
- [ ] Deadlock
- [ ] Thread Safety
- [ ] Lock
- [ ] SemaphoreSlim
- [ ] CPU-bound vs I/O-bound

### 💡 Önemli detay

Async/Await tek başına yeni bir thread oluşturmaz. I/O işlemlerinde bekleme süresince thread'in bloklanmasını önler.

```csharp
public async Task<List<User>> GetUsersAsync(
    CancellationToken cancellationToken)
{
    return await context.Users
        .AsNoTracking()
        .ToListAsync(cancellationToken);
}
```

---

## 03. ASP.NET Core

⏱️ Süre: 2 Saat | 🔴 Critical

### Çalışılacak konular

- [ ] Middleware
- [ ] Request Pipeline
- [ ] Dependency Injection
- [ ] Singleton / Scoped / Transient
- [ ] Routing
- [ ] Model Binding
- [ ] Model Validation
- [ ] Filters
- [ ] IActionResult vs ActionResult
- [ ] Minimal API vs Controller API
- [ ] Configuration
- [ ] Options Pattern
- [ ] Logging
- [ ] Global Exception Handling

### 💡 Dependency Injection

| Lifetime | Yaşam süresi | Kullanım |
|---|---|---|
| Singleton | Uygulama boyunca | Stateless shared services |
| Scoped | Her request için | DbContext |
| Transient | Her çözümlemede | Hafif, stateless servisler |

### 💡 Middleware örneği

```csharp
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public RequestLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        Console.WriteLine("Request Started");

        await _next(context);

        Console.WriteLine("Request Finished");
    }
}
```

### Request Pipeline

```text
HTTP Request
     |
     v
Exception Middleware
     |
     v
Authentication
     |
     v
Authorization
     |
     v
Routing / Endpoint
     |
     v
Controller
     |
     v
HTTP Response
```

---

## 04. Day 1 Review

⏱️ Süre: 1–1.5 Saat

- [ ] C# konularını notlara bakmadan anlat.
- [ ] Async/Await mantığını örnekle açıkla.
- [ ] DI lifetime farklarını anlat.
- [ ] Middleware pipeline çiz.
- [ ] Kendi projen üzerinden 5 teknik örnek ver.

**Day 1 Completion Criteria**

> C# temel kavramlarını, Async/Await mekanizmasını ve ASP.NET Core request lifecycle sürecini teknik olarak açıklayabilmeliyim.

---

# 📅 DAY 2 — DATABASE, ARCHITECTURE & BACKEND

**Hedef:** Veri erişimi, mimari tasarım, performans ve dağıtık sistemler konusunda teknik yeterliliği güçlendirmek.

**Tahmini süre:** 8 Saat

## 05. Entity Framework Core

⏱️ Süre: 2 Saat | 🔴 Critical

### Çalışılacak konular

- [ ] DbContext
- [ ] DbSet
- [ ] Code First vs Database First
- [ ] Migration
- [ ] Change Tracking
- [ ] AsNoTracking()
- [ ] Eager Loading
- [ ] Lazy Loading
- [ ] Explicit Loading
- [ ] Include / ThenInclude
- [ ] N+1 Problem
- [ ] SaveChanges / SaveChangesAsync
- [ ] Transactions
- [ ] Optimistic Concurrency
- [ ] Repository Pattern
- [ ] Unit of Work

### 💡 Performans örneği

```csharp
var users = await context.Users
    .AsNoTracking()
    .Where(x => x.IsActive)
    .Select(x => new UserDto
    {
        Id = x.Id,
        Name = x.Name
    })
    .ToListAsync();
```

**Performans notları:**

- Read-only sorgularda AsNoTracking değerlendir.
- Gereksiz Include kullanma.
- İhtiyaç olmayan kolonları çekme.
- N+1 problemini kontrol et.
- Pagination uygula.
- SQL sorgularını incele.

---

## 06. SQL & Database

⏱️ Süre: 1.5 Saat | 🔴 Critical

### Çalışılacak konular

- [ ] INNER JOIN
- [ ] LEFT JOIN
- [ ] RIGHT JOIN
- [ ] GROUP BY
- [ ] HAVING
- [ ] Subquery
- [ ] CTE
- [ ] Index
- [ ] Clustered Index
- [ ] Non-Clustered Index
- [ ] Composite Index
- [ ] Execution Plan
- [ ] Stored Procedure
- [ ] View
- [ ] Normalization
- [ ] ACID
- [ ] Isolation Levels
- [ ] Deadlock
- [ ] Optimistic / Pessimistic Locking

### 💡 SQL Performance Checklist

Bir sorgu yavaşsa:

1. Execution Plan incele.
2. Index kullanımını kontrol et.
3. Table Scan olup olmadığını değerlendir.
4. JOIN işlemlerini incele.
5. Gereksiz kolonları kaldır.
6. Veri hacmini ve filtre seçiciliğini değerlendir.
7. Lock ve blocking durumlarını kontrol et.

---

## 07. SOLID & Design Patterns

⏱️ Süre: 2 Saat | 🔴 Critical

### SOLID Principles

- [ ] S — Single Responsibility Principle
- [ ] O — Open/Closed Principle
- [ ] L — Liskov Substitution Principle
- [ ] I — Interface Segregation Principle
- [ ] D — Dependency Inversion Principle

### Design Patterns

- [ ] Repository Pattern
- [ ] Unit of Work
- [ ] Factory Pattern
- [ ] Strategy Pattern
- [ ] Singleton Pattern
- [ ] Decorator Pattern
- [ ] Mediator Pattern

### 💡 Strategy Pattern örneği

```csharp
public interface IPaymentStrategy
{
    Task PayAsync(decimal amount);
}

public class CreditCardPayment : IPaymentStrategy
{
    public Task PayAsync(decimal amount)
    {
        Console.WriteLine("Credit Card Payment");
        return Task.CompletedTask;
    }
}

public class PaymentService
{
    private readonly IPaymentStrategy _strategy;

    public PaymentService(IPaymentStrategy strategy)
    {
        _strategy = strategy;
    }

    public Task ProcessAsync(decimal amount)
    {
        return _strategy.PayAsync(amount);
    }
}
```

---

## 08. Clean Architecture & CQRS

⏱️ Süre: 1 Saat | 🟠 High

### Çalışılacak konular

- [ ] Clean Architecture
- [ ] Domain Layer
- [ ] Application Layer
- [ ] Infrastructure Layer
- [ ] Presentation Layer
- [ ] Dependency Rule
- [ ] DTO
- [ ] CQRS
- [ ] MediatR
- [ ] Command / Query
- [ ] Domain Events

### 💡 Mimari yapı

```text
        Presentation
              |
              v
         Application
              |
              v
            Domain

        Infrastructure
              |
              v
       External Services
```

**Önemli noktalar:**

- Domain katmanı iş kurallarını içerir.
- Application katmanı use-case'leri yönetir.
- Infrastructure dış servis ve veri erişim detaylarını içerir.
- Presentation HTTP/API katmanıdır.
- Bağımlılıklar iç katmanlara doğru yönelmelidir.

---

## 09. Authentication & Security

⏱️ Süre: 1 Saat | 🟠 High

### Çalışılacak konular

- [ ] JWT Authentication
- [ ] Access Token
- [ ] Refresh Token
- [ ] Claims
- [ ] Roles
- [ ] Authentication vs Authorization
- [ ] OAuth2
- [ ] OpenID Connect
- [ ] CORS
- [ ] CSRF
- [ ] SQL Injection
- [ ] Password Hashing
- [ ] HTTPS
- [ ] Rate Limiting

---

## 10. Redis & RabbitMQ

⏱️ Süre: 1.5 Saat | 🟠 High

### Redis

- [ ] In-Memory Cache
- [ ] Distributed Cache
- [ ] Cache-Aside Pattern
- [ ] Cache Invalidation
- [ ] TTL
- [ ] Cache Consistency
- [ ] Redis Data Structures

### RabbitMQ

- [ ] Producer / Consumer
- [ ] Queue
- [ ] Exchange
- [ ] Binding
- [ ] Direct Exchange
- [ ] Fanout Exchange
- [ ] Topic Exchange
- [ ] Retry Mechanism
- [ ] Dead Letter Queue
- [ ] Message Acknowledgement

---

# 📅 DAY 3 — PRACTICE & CONSOLIDATION

**Hedef:** Öğrenilen konuları pratik uygulamalarla pekiştirmek.

**Tahmini süre:** 4–5 Saat

## 11. System Design

⏱️ Süre: 1 Saat | 🟠 High

### Çalışılacak konular

- [ ] Monolith vs Microservices
- [ ] Horizontal Scaling
- [ ] Vertical Scaling
- [ ] Load Balancer
- [ ] API Gateway
- [ ] Distributed Cache
- [ ] Message Broker
- [ ] Event-Driven Architecture
- [ ] Distributed Transaction
- [ ] Idempotency
- [ ] Retry & Circuit Breaker

---

## 12. Coding Practice

⏱️ Süre: 1.5 Saat | 🔴 Critical

### Easy

- [ ] String içerisindeki tekrar eden karakterleri bul.
- [ ] Bir listedeki duplicate elemanları bul.
- [ ] İki string'in anagram olup olmadığını kontrol et.
- [ ] Bir listedeki ikinci en büyük sayıyı bul.
- [ ] Bir listedeki en çok tekrar eden elemanı bul.

### LINQ

- [ ] GroupBy kullanarak tekrar eden kayıtları bul.
- [ ] OrderBy ve ThenBy kullan.
- [ ] SelectMany ile iç içe koleksiyonları düzleştir.
- [ ] FirstOrDefault ve SingleOrDefault farkını göster.
- [ ] Join işlemini LINQ ile yap.

### Backend Coding

- [ ] Generic Repository oluştur.
- [ ] Pagination implementasyonu yap.
- [ ] Async API çağrısı yaz.
- [ ] CancellationToken kullan.
- [ ] Basit bir CRUD API oluştur.

---

## 13. Project Architecture & Experience

⏱️ Süre: 30–45 Dakika

### Proje değerlendirme checklist

- [ ] Son çalıştığın projeyi teknik olarak açıkla.
- [ ] Projenin mimarisini çiz.
- [ ] Kullanılan teknolojileri listele.
- [ ] Teknoloji tercihlerini değerlendir.
- [ ] Çözdüğün en zor teknik problemi belirle.
- [ ] Production ortamında yaşanan problemleri incele.
- [ ] Performans optimizasyonlarını değerlendir.
- [ ] Database optimizasyonlarını incele.
- [ ] Redis veya RabbitMQ kullanım senaryolarını değerlendir.
- [ ] Unit Test yapısını incele.
- [ ] Code Review süreçlerini gözden geçir.
- [ ] CI/CD pipeline yapısını incele.

### STAR Method ile problem analizi

| Aşama | Açıklama |
|---|---|
| Situation | Problem hangi ortamda ortaya çıktı? |
| Task | Sorumluluk neydi? |
| Action | Hangi teknik çözüm uygulandı? |
| Result | Sonuç ne oldu? |

---

## 14. Final Knowledge Review

⏱️ Süre: 1 Saat

Aşağıdaki konuları notlara bakmadan açıklayabil:

- [ ] IQueryable vs IEnumerable
- [ ] Async vs Sync
- [ ] Task vs Thread
- [ ] Scoped vs Singleton
- [ ] Middleware Pipeline
- [ ] EF Core Change Tracking
- [ ] N+1 Problem
- [ ] SQL Index
- [ ] SOLID Principles
- [ ] Clean Architecture
- [ ] CQRS
- [ ] JWT
- [ ] Redis
- [ ] RabbitMQ
- [ ] Microservices
- [ ] API Performance Optimization
- [ ] Transaction Management
- [ ] Deadlock
- [ ] Dependency Injection
- [ ] Project Architecture

---

# 🧠 MASTER KNOWLEDGE CHECKLIST

| Yetkinlik | Tamamlandı |
|---|---|
| C# Fundamentals | [ ] |
| OOP | [ ] |
| SOLID | [ ] |
| Async / Await | [ ] |
| Multithreading | [ ] |
| ASP.NET Core | [ ] |
| Dependency Injection | [ ] |
| Middleware | [ ] |
| EF Core | [ ] |
| SQL Optimization | [ ] |
| Design Patterns | [ ] |
| Clean Architecture | [ ] |
| CQRS / MediatR | [ ] |
| JWT / Security | [ ] |
| Redis | [ ] |
| RabbitMQ | [ ] |
| System Design | [ ] |
| Coding Practice | [ ] |
| Project Architecture | [ ] |

---

# ⭐ EFFECTIVE LEARNING STRATEGY

Her teknik konuyu çalışırken aşağıdaki sıralamayı kullan:

**1. Definition**

Kavramın ne olduğunu öğren.

**2. Working Principle**

Nasıl çalıştığını teknik olarak anla.

**3. Real-World Usage**

Gerçek projede nerede kullanılacağını belirle.

**4. Advantages / Disadvantages**

Avantajlarını ve dezavantajlarını değerlendir.

**5. Code Example**

Gerekirse kısa bir C# örneği yaz.

### Örnek: Redis

- Definition: Redis, RAM üzerinde çalışan bir in-memory data store'dur.
- Working Principle: Key-value mantığıyla veri saklar ve TTL gibi mekanizmalar sunar.
- Real-World Usage: Sık erişilen ürün veya kullanıcı verilerini cache'lemek için kullanılabilir.
- Advantages: Düşük latency, hızlı erişim ve distributed cache desteği.
- Disadvantages: Cache invalidation ve consistency problemleri.

---

# 🏁 FINAL CHECKLIST

## Çalışma tamamlanmadan önce

- [ ] C# temel kavramlarını tekrar et.
- [ ] Async/Await konusunu iyi öğren.
- [ ] DI lifetime farklarını netleştir.
- [ ] EF Core performans konularını tekrar et.
- [ ] SOLID prensiplerini örneklerle anlat.
- [ ] SQL Index ve Execution Plan konularını gözden geçir.
- [ ] Redis ve RabbitMQ'nun kullanım senaryolarını öğren.
- [ ] Kendi projenin mimarisini anlatmaya hazırlan.
- [ ] En az 10 coding sorusu çöz.
- [ ] Bir mini proje geliştir veya mevcut projeni incele.
- [ ] Öğrendiğin konuları tekrar et.
- [ ] Yeterince dinlen.

---

> **FINAL REMINDER**
>
> İyi bir backend developer yalnızca kullandığı teknolojileri bilmez.
>
> Bu teknolojilerin neden kullanıldığını, nasıl çalıştığını, hangi problemlere çözüm getirdiğini ve alternatiflerini de bilir.
>
> **Ezberleme. Anla, uygula ve derinleştir.**
>
> Happy Coding! 🚀
