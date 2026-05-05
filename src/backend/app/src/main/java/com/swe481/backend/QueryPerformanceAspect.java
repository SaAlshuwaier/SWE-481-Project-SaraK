package com.swe481.backend;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class QueryPerformanceAspect {
    private static final Logger log = LoggerFactory.getLogger(QueryPerformanceAspect.class);

    // This applies to ALL methods in ALL classes inside Repo package
    @Around("execution(* com.swe481.backend.Dto.Repo.*.*(..))")
    public Object measureQueryTime(ProceedingJoinPoint joinPoint) throws Throwable {

        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        long start = System.nanoTime();

        Object result = joinPoint.proceed();

        double duration = (System.nanoTime() - start) / 1_000_000.0; // convert to ms with decimals

        if (duration > 500) {
            log.warn("[{}] [{}] Query time: {} ms ⚠️ EXCEEDED 500ms TARGET", className, methodName,
                    String.format("%.2f", duration));
        } else {
            log.info("[{}] [{}] Query time: {} ms ✅ OK", className, methodName, String.format("%.2f", duration));
        }

        return result;
    }
}
