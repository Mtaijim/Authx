package com.example.Authx.services;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final Map<String , Bucket> loginBuckets =
            new ConcurrentHashMap<>();

    private final Map<String, Bucket> forgetPasswordBuckets =
            new ConcurrentHashMap<>();
    private final Map<String, Bucket> registerBuckets =
            new ConcurrentHashMap<>();



    public Bucket getLoginBucket(String ip ){
        return loginBuckets.computeIfAbsent(
                ip,
                key-> buildBucket(6, Duration.ofMinutes(15))
        );
    }


    public Bucket getForgetPasswordBucket(String email ){
        return forgetPasswordBuckets.
                computeIfAbsent(email.toLowerCase(),
                        key-> buildBucket(3, Duration.ofHours(1)));


    }

 public Bucket getRegisterBucket(String email) {
        return registerBuckets.computeIfAbsent(
                email.toLowerCase(),
                key -> buildBucket(3, Duration.ofHours(1))
        );
    }
    public boolean tryConsume(Bucket bucket) {
        return bucket.tryConsume(1);
    }

    public long remainingTokens(Bucket bucket) {
        return bucket.getAvailableTokens();
    }


    private Bucket buildBucket(int capacity,
                               Duration duration) {
        Bandwidth limit = Bandwidth.classic(
                capacity,
                Refill.greedy(capacity, duration)
        );
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}
