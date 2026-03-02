# 💰 Payment Integration Guide - EthoLife

**Версия:** 1.0  
**Дата:** 2026-03-02  
**Статус:** Готово к реализации

---

## 🎯 Требования

- ✅ Без юрлица (физическое лицо)
- ✅ Криптовалюта + Фиат
- ✅ Быстрый старт (1-3 дня)
- ✅ Минимальные комиссии
- ✅ Автоматизация
- ✅ Подписка + разовые платежи
- ✅ Продажа токенов UNITY

---

## 🚀 Вариант 1: Криптоплатежи (ПРИОРИТЕТ)

### NowPayments.io ⭐ РЕКОМЕНДУЮ
**Сайт:** https://nowpayments.io  
**Статус:** ✅ Работает для физлиц  
**Время подключения:** 1 день

#### Преимущества:
- ✅ Не требует юрлица
- ✅ 150+ криптовалют
- ✅ Автоматическая конвертация
- ✅ Низкие комиссии (0.5-1%)
- ✅ API для подписок
- ✅ Виджеты для сайта
- ✅ Instant payouts

#### Поддерживаемые монеты:
```
- BTC (Bitcoin)
- ETH (Ethereum)
- USDT (Tether) - РЕКОМЕНДУЮ (стабильный)
- USDC (USD Coin)
- BNB (Binance Coin)
- SOL (Solana)
- MATIC (Polygon)
- TON (Telegram) - ПЕРСПЕКТИВНО
- UNITY (наш токен в будущем)
```

#### Настройка:

**1. Регистрация:**
```
1. Перейти на nowpayments.io
2. Sign Up (email)
3. Verify email
4. Получить API Key в dashboard
```

**2. API Integration:**
```typescript
// server/routes/payments-crypto.ts

import NowPaymentsAPI from 'nowpayments-api';

const np = new NowPaymentsAPI({
  apiKey: process.env.NOWPAYMENTS_API_KEY,
});

// Создание платежа
router.post('/create', async (req, res) => {
  const { amount, currency, userId } = req.body;
  
  const payment = await np.createPayment({
    price_amount: amount,
    price_currency: currency, // 'USD'
    pay_currency: 'USDT', // или любая другая
    order_id: `order_${userId}_${Date.now()}`,
    order_description: `EthoLife Subscription - ${amount} USD`,
    ipn_callback_url: 'https://your-domain.com/api/payments/crypto/ipn',
  });
  
  res.json(payment);
});

// Webhook для подтверждения
router.post('/ipn', async (req, res) => {
  const { order_id, payment_status, pay_address } = req.body;
  
  if (payment_status === 'finished') {
    // Активировать подписку
    await activateSubscription(order_id);
  }
  
  res.sendStatus(200);
});
```

**3. Frontend Widget:**
```typescript
// client/src/components/CryptoPayment.tsx

export function CryptoPayment({ amount, currency = 'USD' }) {
  const [paymentUrl, setPaymentUrl] = useState('');
  
  const createPayment = async () => {
    const response = await fetch('/api/payments/crypto/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency,
        userId: user.id,
      }),
    });
    
    const data = await response.json();
    setPaymentUrl(data.pay_address);
    
    // Redirect на оплату
    window.location.href = data.pay_url;
  };
  
  return (
    <Button onClick={createPayment}>
      Pay with Crypto
    </Button>
  );
}
```

#### Комиссии:
```
- NowPayments: 0.5-1%
- Сетевые комиссии: ~$1-5 (зависит от монеты)
- Вывод на кошелек: бесплатно
```

---

### CoinPayments.net
**Сайт:** https://coinpayments.net  
**Статус:** ✅ Альтернатива  
**Время подключения:** 1 день

#### Преимущества:
- ✅ 2000+ криптовалют
- ✅ Merchant tools
- ✅ Auto conversions
- ✅ Wallet included

---

## 💳 Вариант 2: Фиатные платежи

### Stripe (через P2P) ⭐ РЕКОМЕНДУЮ
**Сайт:** https://stripe.com  
**Статус:** ⚠️ Требует юрлица ИЛИ Stripe Atlas  
**Время подключения:** 3-7 дней

#### Опция A: Stripe Atlas (с юрлицом)
```
- Регистрация компании в США
- Стоимость: $500
- Время: 5-7 дней
- Преимущества: полноценный Stripe
```

#### Опция B: Stripe через посредника
```
- Найти партнера с юрлицом
- Использовать их аккаунт
- Комиссия: 5-10% от оборота
```

---

### PayPal (Personal)
**Сайт:** https://paypal.com  
**Статус:** ✅ Работает для физлиц  
**Время подключения:** 1 день

#### Преимущества:
- ✅ Мгновенное подключение
- ✅ Доверие пользователей
- ✅ Легкая интеграция

#### Недостатки:
- ❌ Высокие комиссии (3.9-5.4%)
- ❌ Частые блокировки
- ❌ Нет авто-биллинга для физлиц

#### Integration:
```typescript
// client/src/components/PayPalButton.tsx

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export function PayPalPayment({ amount }: { amount: number }) {
  return (
    <PayPalScriptProvider options={{ clientId: process.env.PAYPAL_CLIENT_ID }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: amount.toString() }
            }]
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            // Активировать подписку
            activateSubscription(details.id);
          });
        }}
      />
    </PayPalScriptProvider>
  );
}
```

---

### Crypto + Fiat Hybrid: CoinGate
**Сайт:** https://coingate.com  
**Статус:** ✅ Работает для физлиц  
**Время подключения:** 1-2 дня

#### Преимущества:
- ✅ Принимает крипту и фиат
- ✅ Автоматическая конвертация
- ✅ Низкие комиссии (1%)
- ✅ Invoice система

---

## 🪙 Вариант 3: Продажа токенов UNITY

### Простой вариант (СЕЙЧАС)
**Статус:** ✅ Без юрлица

```typescript
// Прямая продажа через смарт-контракт

// 1. Создать токен UNITY (ERC-20 на Polygon)
// 2. Разместить на QuickSwap/DexTools
// 3. Продавать через сайт

// Smart Contract (Solidity)
contract UNITYToken {
  mapping(address => uint256) public balances;
  
  function buyTokens() public payable {
    uint256 tokens = msg.value * TOKEN_PRICE;
    balances[msg.sender] += tokens;
  }
  
  function sellTokens(uint256 amount) public {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    payable(msg.sender).transfer(amount * TOKEN_PRICE);
  }
}
```

### Продвинутый вариант (ПОТОМ)
**Статус:** ❌ Требует юрлица

```
- Legal opinion (SEC compliance)
- KYC/AML integration
- Accredited investors only
- Reg D / Reg S exemption
```

---

## 🎯 РЕКОМЕНДУЕМАЯ СТРАТЕГИЯ

### Этап 1: Старт (СЕЙЧАС)

**Криптоплатежи (NowPayments):**
```
✅ USDT (Tether) - стабильный, низкие комиссии
✅ USDC (USD Coin)
✅ BTC, ETH - для крупных платежей
✅ TON - для Telegram пользователей
```

**PayPal Personal:**
```
✅ Для пользователей без крипты
⚠️ Высокие комиссии (4-5%)
```

**Прямая продажа токенов:**
```
✅ Смарт-контракт на Polygon
✅ Через сайт (Web3)
```

### Этап 2: Рост (1-3 месяца)

**Stripe Atlas:**
```
- Регистрация компании в США ($500)
- Полноценный Stripe
- Авто-биллинг для подписок
```

**Paddle.com:**
```
- Merchant of Record
- Решают вопросы с налогами
- Комиссия: 5% + $0.50
```

### Этап 3: Масштаб (3-6 месяцев)

**Собственное юрлицо:**
```
- Регистрация компании
- Банковский счет
- Полная автоматизация
```

---

## 📦 Готовое решение для EthoLife

### server/routes/payments.ts

```typescript
import { Router } from 'express';
import NowPaymentsAPI from 'nowpayments-api';
import Stripe from 'stripe';

const router = Router();

// NowPayments
const np = new NowPaymentsAPI({
  apiKey: process.env.NOWPAYMENTS_API_KEY,
});

// Stripe (когда будет)
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Создание платежа
router.post('/create', async (req, res) => {
  const { 
    amount, 
    currency = 'USD', 
    type, // 'subscription' | 'one-time' | 'tokens'
    userId,
    planId,
  } = req.body;
  
  try {
    // NowPayments (крипто)
    const payment = await np.createPayment({
      price_amount: amount,
      price_currency: currency,
      pay_currency: 'USDT',
      order_id: `${type}_${userId}_${Date.now()}`,
      order_description: `EthoLife ${type} - $${amount}`,
      ipn_callback_url: `${process.env.API_URL}/api/payments/ipn`,
    });
    
    // Сохранить в БД
    await savePayment({
      userId,
      amount,
      type,
      planId,
      cryptoAddress: payment.pay_address,
      status: 'pending',
    });
    
    res.json({
      success: true,
      paymentUrl: payment.pay_url,
      payAddress: payment.pay_address,
      amount: payment.pay_amount,
      currency: payment.pay_currency,
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

// Webhook от NowPayments
router.post('/ipn', async (req, res) => {
  const { 
    order_id, 
    payment_status, 
    pay_address,
    pay_amount,
  } = req.body;
  
  try {
    // Проверка подписи
    const signature = req.headers['x-nowpayments-sig'];
    if (!verifySignature(signature, req.body)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    if (payment_status === 'finished') {
      // Найти платеж в БД
      const payment = await getPayment(order_id);
      
      // Активировать подписку или токены
      if (payment.type === 'subscription') {
        await activateSubscription(payment.userId, payment.planId);
      } else if (payment.type === 'tokens') {
        await issueTokens(payment.userId, pay_amount);
      }
      
      // Обновить статус
      await updatePaymentStatus(order_id, 'completed');
      
      // Уведомить пользователя
      await sendNotification(payment.userId, {
        type: 'payment_completed',
        amount: pay_amount,
      });
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('IPN error:', error);
    res.status(500).json({ error: 'IPN failed' });
  }
});

// Подтверждение оплаты (frontend polling)
router.get('/status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  
  const payment = await getPayment(orderId);
  
  res.json({
    success: true,
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
  });
});

export default router;
```

### client/src/components/PaymentSelector.tsx

```typescript
export function PaymentSelector({ amount, type, planId }: PaymentProps) {
  const [method, setMethod] = useState<'crypto' | 'paypal'>('crypto');
  const [processing, setProcessing] = useState(false);
  
  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'USD',
          type,
          planId,
          userId: user.id,
        }),
      });
      
      const data = await response.json();
      
      if (method === 'crypto') {
        // Redirect на крипто-оплату
        window.location.href = data.paymentUrl;
      } else if (method === 'paypal') {
        // PayPal flow
        // ...
      }
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Выберите способ оплаты</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Crypto */}
          <div
            onClick={() => setMethod('crypto')}
            className={`p-4 border-2 rounded-lg cursor-pointer ${
              method === 'crypto' ? 'border-emerald-500' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold">Cryptocurrency</p>
                <p className="text-sm text-gray-500">USDT, BTC, ETH, TON</p>
              </div>
              <Badge>1% fee</Badge>
            </div>
          </div>
          
          {/* PayPal */}
          <div
            onClick={() => setMethod('paypal')}
            className={`p-4 border-2 rounded-lg cursor-pointer ${
              method === 'paypal' ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <PayPal className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">PayPal</p>
                <p className="text-sm text-gray-500">Credit/Debit Card</p>
              </div>
              <Badge variant="outline">4.9% fee</Badge>
            </div>
          </div>
          
          {/* Token Purchase */}
          {type === 'tokens' && (
            <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
              <p className="font-semibold text-purple-900">
                Buy UNITY Tokens
              </p>
              <p className="text-sm text-purple-700">
                1 UNITY = $0.01 USD
              </p>
              <p className="text-xs text-purple-600 mt-2">
                Tokens will be sent to your wallet
              </p>
            </div>
          )}
          
          <Button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {processing ? 'Processing...' : `Pay $${amount}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 📊 Сравнение вариантов

| Провайдер | Комиссия | Юрлицо | Время | Крипто | Фиат |
|-----------|----------|--------|-------|--------|------|
| **NowPayments** | 0.5-1% | ❌ Нет | 1 день | ✅ 150+ | ❌ |
| **PayPal** | 3.9-5.4% | ❌ Нет | 1 день | ❌ | ✅ |
| **CoinPayments** | 0.5-1% | ❌ Нет | 1 день | ✅ 2000+ | ❌ |
| **CoinGate** | 1% | ❌ Нет | 1-2 дня | ✅ 80+ | ✅ |
| **Stripe** | 2.9% + $0.30 | ✅ Да | 3-7 дней | ❌ | ✅ |
| **Paddle** | 5% + $0.50 | ❌ Нет | 2-3 дня | ❌ | ✅ |

---

## 🎯 ИТОГОВАЯ РЕКОМЕНДАЦИЯ

### СЕЙЧАС (Без юрлица):

```
1. NowPayments (крипто) - ОСНОВНОЙ
   - USDT, USDC (стабильные)
   - BTC, ETH (крупные платежи)
   - TON (Telegram интеграция)

2. PayPal Personal (фиат)
   - Для пользователей без крипты
   - Разовые платежи

3. Смарт-контракт UNITY
   - Прямая продажа токенов
   - Polygon network (низкие комиссии)
```

### ЧЕРЕЗ 1-3 МЕСЯЦА:

```
4. Stripe Atlas ($500)
   - Регистрация компании в США
   - Полноценный Stripe
   - Авто-биллинг подписок

5. Paddle (альтернатива)
   - Merchant of Record
   - Решают налоги
```

### ЧЕРЕЗ 3-6 МЕСЯЦЕВ:

```
6. Собственное юрлицо
   - Полная автоматизация
   - Все платежные системы
   - Банковский счет
```

---

## 📞 Быстрый старт

### День 1:
```bash
# 1. Регистрация NowPayments
- nowpayments.io → Sign Up
- Получить API Key

# 2. Добавить переменные
TELEGRAM_BOT_TOKEN=your-token
NOWPAYMENTS_API_KEY=your-api-key

# 3. Установить зависимости
pnpm add nowpayments-api

# 4. Интегрировать (код выше)
```

### День 2:
```bash
# 1. Тестирование
- Создать тестовый платеж
- Проверить webhook
- Активировать подписку

# 2. PayPal (опционально)
- paypal.com/business
- Получить Client ID
- Интегрировать кнопку
```

### День 3:
```bash
# 1. Unity Token
- Создать ERC-20 контракт
- Разместить на QuickSwap
- Добавить на сайт
```

---

**Готово к запуску!** 🚀
