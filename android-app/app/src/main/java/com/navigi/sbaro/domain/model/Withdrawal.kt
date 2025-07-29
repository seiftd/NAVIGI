package com.navigi.sbaro.domain.model

import kotlinx.serialization.Serializable

@Serializable
data class Withdrawal(
    val id: String = "",
    val userId: String = "",
    val userName: String = "",
    val method: WithdrawalMethod,
    val amount: Long = 0L, // Amount in SBARO points
    val dollarAmount: Double = 0.0, // Equivalent dollar amount
    val status: WithdrawalStatus = WithdrawalStatus.PENDING,
    val paymentDetails: PaymentDetails,
    val requestedAt: String = "",
    val processedAt: String = "",
    val completedAt: String = "",
    val rejectedAt: String = "",
    val rejectionReason: String = "",
    val adminNotes: String = "",
    val transactionId: String = "",
    val processingFee: Double = 0.0,
    val finalAmount: Double = 0.0,
    val exchangeRate: Double = 1.0,
    val approvedBy: String = "",
    val processedBy: String = ""
)

@Serializable
sealed class PaymentDetails {
    @Serializable
    data class BinancePayDetails(
        val email: String
    ) : PaymentDetails()
    
    @Serializable
    data class BaridiMobDetails(
        val phoneNumber: String,
        val daAmount: Double
    ) : PaymentDetails()
    
    @Serializable
    data class GooglePlayCardDetails(
        val cardValue: Int, // In dollars
        val cardCode: String = "", // Set by admin when processed
        val cardPin: String = "" // Set by admin when processed
    ) : PaymentDetails()
    
    @Serializable
    data class FlexyDetails(
        val phoneNumber: String,
        val carrier: FlexyCarrier,
        val daAmount: Double
    ) : PaymentDetails()
}

enum class WithdrawalMethod {
    BINANCE_PAY,
    BARIDIMOB,
    GOOGLE_PLAY_CARD,
    FLEXY
}

enum class WithdrawalStatus {
    PENDING,
    PROCESSING,
    APPROVED,
    COMPLETED,
    REJECTED,
    CANCELLED
}

enum class FlexyCarrier {
    MOBILIS,
    OOREDOO
}

// Extension functions for Withdrawal model
fun Withdrawal.isPending(): Boolean = status == WithdrawalStatus.PENDING

fun Withdrawal.isProcessing(): Boolean = status == WithdrawalStatus.PROCESSING

fun Withdrawal.isApproved(): Boolean = status == WithdrawalStatus.APPROVED

fun Withdrawal.isCompleted(): Boolean = status == WithdrawalStatus.COMPLETED

fun Withdrawal.isRejected(): Boolean = status == WithdrawalStatus.REJECTED

fun Withdrawal.isCancelled(): Boolean = status == WithdrawalStatus.CANCELLED

fun Withdrawal.canBeCancelled(): Boolean = status in listOf(
    WithdrawalStatus.PENDING, 
    WithdrawalStatus.PROCESSING
)

fun Withdrawal.getMethodDisplayName(): String = when (method) {
    WithdrawalMethod.BINANCE_PAY -> "Binance Pay"
    WithdrawalMethod.BARIDIMOB -> "BaridiMob"
    WithdrawalMethod.GOOGLE_PLAY_CARD -> "Google Play Gift Card"
    WithdrawalMethod.FLEXY -> "Flexy"
}

fun Withdrawal.getStatusDisplayName(): String = when (status) {
    WithdrawalStatus.PENDING -> "Pending"
    WithdrawalStatus.PROCESSING -> "Processing"
    WithdrawalStatus.APPROVED -> "Approved"
    WithdrawalStatus.COMPLETED -> "Completed"
    WithdrawalStatus.REJECTED -> "Rejected"
    WithdrawalStatus.CANCELLED -> "Cancelled"
}

fun Withdrawal.getProcessingTime(): String = when (method) {
    WithdrawalMethod.BINANCE_PAY, WithdrawalMethod.GOOGLE_PLAY_CARD -> "Within 8 hours"
    WithdrawalMethod.BARIDIMOB, WithdrawalMethod.FLEXY -> "Within 8 hours"
}

fun Withdrawal.getMinimumAmount(): Long = when (method) {
    WithdrawalMethod.BINANCE_PAY -> 20L // $2
    WithdrawalMethod.BARIDIMOB -> 55L // $5.5
    WithdrawalMethod.GOOGLE_PLAY_CARD -> 10L // $1
    WithdrawalMethod.FLEXY -> 10L // $1
}

fun Withdrawal.calculateDaAmount(): Double = when (method) {
    WithdrawalMethod.BARIDIMOB, WithdrawalMethod.FLEXY -> dollarAmount * 18.0
    else -> 0.0
}

fun Withdrawal.getPaymentDisplayInfo(): String = when (val details = paymentDetails) {
    is PaymentDetails.BinancePayDetails -> details.email
    is PaymentDetails.BaridiMobDetails -> details.phoneNumber
    is PaymentDetails.GooglePlayCardDetails -> "$${details.cardValue} Gift Card"
    is PaymentDetails.FlexyDetails -> "${details.carrier.name} - ${details.phoneNumber}"
}